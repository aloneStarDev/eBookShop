const express = require("express");
const validate_password = require("../utils/password-validator");
const cfg = require("../configs/config.json");
const fs = require("fs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const FObject = require("../models/FObject");
const multer = require('multer');
const e = require("express");
const router = express.Router();
const upload = multer({
    dest: '/data'
});

router.post("/file/add", upload.array("files"), async (req, res, next) => {
    const FObjectModel = mongoose.model("FObject");
    const UserModel = mongoose.model("User");
    if (req.files.length === 0) {
        res.status(400);
        next("at least one file must be upload");
        return;
    }
    if (req.body.public !== undefined) {
        if (typeof (req.body.public) !== "string") {
            res.status(400);
            next("public must be boolean string");
            return;
        } else {
            req.body.public = req.body.public === "true" ? true : false;
        }
    }
    if (req.body.parent !== undefined && typeof (req.body.parent) !== "string") {
        res.status(400);
        next("parent must be string");
        return;
    } else if (req.body.parent !== "/" && await FObjectModel.count({ ftype: FObject.types.Folder, _id: req.body.parent }) !== 1) {
        res.status(400);
        next("invalid folder as parent detected");
        return;
    }
    if (req.body.access) {
        try {
            req.body.access = JSON.parse(req.body.access);
        } catch (e) {
            res.status(400);
            next("access must be array of string");
            return;
        }
        for (let i in req.body.access) {
            if (typeof (req.body.access[i]) !== "string") {
                res.status(400);
                next("access must be array of string");
                return;
            }
        }
        req.body.access = (await UserModel.find({ "username": { "$in": req.body.access } })).map(x => x._id.toString());
    }
    let files = []
    for (let f in req.files) {
        let file = FObjectModel({
            ftype: FObject.types.File,
            fid: req.files[f].filename,
            owner: req.jwt.id,
            name: req.files[f].originalname,
            public: false,
            ...req.body
        });
        file.generate_hash(req.files[f].filename);
        await file.save();
        files.push(file);
    }
    res.status(200).json({ ok: true, data: files });
});

router.post("/move", async (req, res,next) => {
    const FObjectModel = mongoose.model("FObject");
    let target_folder;
    if (req.body.target !== "/") {
        target_folder = await FObjectModel.find({
            _id: req.body.target,
            ftype: FObject.types.Folder,
            "$or": [
                { "owner": req.jwt.id },
                { "access": req.jwt.id },
                { "public": true }
            ]
        });
        if (target_folder == null) {
            res.status(400);
            next("access denied!");
            return;
        }
    }
    let fitems_to_move = await FObjectModel.find({ _id: { "$in": req.body.fids }, owner: req.jwt.id })
    if (req.body.fids.length !== fitems_to_move.length) {
        res.status(400);
        next("access denied!");
        return;
    }
    let result = await FObjectModel.updateMany({ _id: { "$in": req.body.fids } }, { "parent": req.body.target });
    if (result.acknowledged && result.modifiedCount === req.body.fids.length) {
        res.status(200).json({ ok: true });
    } else {
        res.status(400);
        next("fail to move all items!");
        return;
    }
});

router.post("/folder/add", async (req, res, next) => {
    const User = mongoose.model("User");
    const FObjectModel = mongoose.model("FObject");
    if (!req.body.name) {
        res.status(400);
        next("name required");
        return;
    }
    if (req.body.access) {
        req.body.access = (await User.find({ "username": { "$in": req.body.access } })).map(x => x._id.toString());
        if (req.body.access.length === 0) {
            res.status(400);
            next("invalid username in access filed");
            return;
        }
    }
    if (req.body.parent && req.body.parent !== "/") {
        if (await FObjectModel.count({ ftype: FObject.types.Folder, _id: req.body.parent }) !== 1) {
            res.status(400);
            next("invalid folder as parent detected");
            return;
        }
    }

    let folder = FObjectModel({
        name: req.body.name,
        owner: req.jwt.id,
        ftype: FObject.types.Folder,
        ...req.body
    });
    folder.save();
    res.status(200).json({ ok: true });
});
async function remove_fobject_recursive(fid, owner) {
    const FObjectModel = mongoose.model("FObject");
    let result = await FObjectModel.findOneAndDelete({
        _id: fid,
        owner
    });
    if (result === null)
        return false;
    if (result.ftype === FObject.types.File) {
        try {
            fs.unlinkSync(`/data/${result.fid}`);
            return true;
        } catch (e) {
            return false;
        }
    }
    else {
        try {
            let childs = await FObjectModel.find({ parent: fid, owner });
            let res = true;
            for (let index in childs) {
                let fitem = childs[index];
                let x = await remove_fobject_recursive(fitem._id, owner);
                res = res && x;
            }
            return res;
        } catch (e) {
            return false;
        }
    }

}

router.post("/remove", async (req, res, next) => {
    let fid = req.body.fid;
    let owner = req.jwt.id;
    if (fid === "/") {
        res.status(400);
        next("can't remove /");
        return;
    }
    let result = await remove_fobject_recursive(fid, owner);
    if (result) {
        res.status(200).json({ ok: true })
    } else {
        res.status(400).json({ ok: false, error: "fail to remove all items recursive or access violation" })
    }
});

router.get("/file/download/:fid", async (req, res, next) => {
    const FObjectModel = mongoose.model("FObject");
    let fitem = await FObjectModel.findOne({
        _id: req.params.fid,
        "$or": [
            { "owner": req.jwt.id },
            { "access": req.jwt.id },
            { "public": true }
        ]
    });
    if (fitem != null) {
        res.setHeader('Content-Disposition', 'attachment; filename=' + fitem.name);
        res.sendFile(fitem.fid, { root: "/data" }, err => {
            if (err) {
                console.log(err);
                //res.status(500).json({ok:false,error:"failed to send file"});
            }
        });
    } else {
        res.status(400).json({ ok: false, error: "invalid fid or access violation" });
    }
});

async function set_access_recursive(fid, owner, access) {
    const FObjectModel = mongoose.model("FObject");
    let result = await FObjectModel.findOneAndUpdate({
        _id: fid,
        owner
    }, { "$set": { "access": access } });
    if (result.ftype === FObject.types.File) {
        return true;
    }
    else {
        try {
            let childs = await FObjectModel.find({ parent: fid, owner });
            let res = true;
            for (let index in childs) {
                let fitem = childs[index];
                let x = await set_access_recursive(fitem._id, owner, access);
                res = res && x;
            }
            return res;
        } catch (e) {
            return false;
        }
    }

}
router.post("/access/change", async (req, res, next) => {
    const FObjectModel = mongoose.model("FObject");
    const UserModel = mongoose.model("User");
    try {
        let parent = await FObjectModel.findOne({ owner: req.jwt.id, _id: req.body.fid })
        if (parent == null) {
            res.status(400)
            next("access denied");
        } else {
            let user_list = await UserModel.find({ username: { "$in": req.body.access } });
            if (user_list.length !== req.body.access.length) {
                res.status(200).json({ ok: false, error: "invalid username in access list" })
                return;
            } else {
                user_list = user_list.map(x => x._id);
                let result = await set_access_recursive(req.body.fid, req.jwt.id, user_list);
                if (result)
                    res.status(200).json({ ok: true });
                else
                    res.status(200).json({ ok: false, error: "fail to change access of all items" });
            }
        }
    } catch (e) {
        res.status(400)
        next("invalid fid");
    }

});


router.post("/access/list", async (req, res, next) => {
    const FObjectModel = mongoose.model("FObject");
    const UserModel = mongoose.model("User");
    let fitem = await FObjectModel.findOne({ owner: req.jwt.id, _id: req.body.fid });
    if (fitem != null) {
        let users = await UserModel.find({ _id: { "$in": fitem.access } });
        res.status(200).json({ ok: true, data: users.map(x => x.username) });
    } else
        res.status(200).json({ ok: false, error: "invallid fid" });
});

router.post("/access/public", async (req, res, next) => {
    const FObjectModel = mongoose.model("FObject");
    const UserModel = mongoose.model("User");
    let fitem = await FObjectModel.findOne({ owner: req.jwt.id, _id: req.body.fid });
    if (fitem == null) {
        res.status(200).json({ ok: false, error: "access denied" });
        return;
    }
    let result = await FObjectModel.updateOne({ owner: req.jwt.id, _id: req.body.fid }, { "$set": { public: !fitem.public } });
    if (result.modifiedCount === 1) {
        res.status(200).json({ ok: true, data: { public: !fitem.public, fid: fitem.fid } });
    } else {
        res.status(200).json({ ok: false, error: "fail to chagne public access" });
    }
});

router.post("/list", async (req, res, next) => {
    const FObjectModel = mongoose.model("FObject");
    const UserModel = mongoose.model("User");
    let fitems = await FObjectModel.find({
        "$or": [
            { owner: req.jwt.id },
            { access: req.jwt.id },
            { public: true }
        ]
    });
    fitems = await Promise.all(fitems.map(async (item) => {
        let ac = (await UserModel.find({ _id: { "$in": item.access } })).map(x => x.username)
        let new_item = {
            ...item._doc,
            access: ac
        };

        return new_item;
    }));
    res.status(200).json({ ok: true, data: fitems });
});

module.exports = router;
