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
const upload = multer({ dest: '/data' })

router.post("/file/add", upload.array("files"), async (req, res, next) => {
    const FObjectModel = mongoose.model("FObject");
    const UserModel = mongoose.model("User");

    if (req.body.public != undefined && typeof (req.body.public) !== "boolean") {
        res.status(400);
        next("vpath must be string");
        return;
    }
    if (req.body.vpath != undefined && typeof (req.body.vpath) !== "string") {
        res.status(400);
        next("vpath must be string");
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
	if(req.body.access.length === 0){
		res.status(400);
		next("invalid username in access filed");
		return;
	}
    }
    if (req.body.vpath) {
        let path = req.body.vpath.split("/");
        if (path[0] !== "" || path.length < 2) {
            res.status(400);
            next("vpath must be absolute");
            return;
        }
        path = path.slice(1);
        let from_root = "/";
        for (let i in path) {
            let p = path[i];
            if (await FObjectModel.count({ name: p, ftype: FObject.types.Folder, vpath: from_root }) !== 1) {
                res.status(400);
                next(from_root + "/" + p + " not a valid folder");
                return;
            }
            if (from_root != "/")
                from_root += "/" + p;
            else
                from_root += p;
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
router.post("/remove", async (req, res, next) => {
    const FObjectModel = mongoose.model("FObject");
    let path = req.body.path.split("/")
    let name = path.slice(path.length - 1)[0]
    let vpath = "/"
    if (path.lenth > 2)
        vpath = path.slice(0, path.length - 1).join("/");
    let result = await FObjectModel.findOneAndDelete({
        vpath,
        name,
        "$or": [
            { owner: req.jwt.id },
        ]
    });
    if (result) {
        if (result.ftype == FObject.types.File) {
            fs.unlinkSync(`/data/${result.fid}`);
        }
        res.status(200).json({ ok: true })
    }
    else
        res.status(200).json({ ok: false,error:"access denied" })
});
router.post("/access/add", async (req, res, next) => {
    const FObjectModel = mongoose.model("FObject");
    const UserModel = mongoose.model("User");
    let user = await UserModel.findOne({ username: req.body.username });
    let path = req.body.path.split("/")
    let name = path.slice(path.length - 1)[0]
    let vpath = "/"
    if (path.lenth > 2)
        vpath = path.slice(0, path.length - 1).join("/");
    let result = await FObjectModel.updateOne({ owner: req.jwt.id, name, vpath }, { "$addToSet": { "access": user["_id"].toString() } });
    if (result.acknowledged && result.modifiedCount === 1)
        res.status(200).json({ ok: true });
    else
        res.status(200).json({ ok: false });
});

router.post("/access/remove", async (req, res, next) => {
    const FObjectModel = mongoose.model("FObject");
    const UserModel = mongoose.model("User");
    let users = await UserModel.find({ username: { "$in": req.body.username } });
    let path = req.body.path.split("/")
    let name = path.slice(path.length - 1)[0]
    let vpath = "/"
    if (path.lenth > 2)
        vpath = path.slice(0, path.length - 1).join("/");
    let result = await FObjectModel.updateOne({ owner: req.jwt.id, name, vpath }, { "$pullAll": { "access": users.map(x => x._id.toString()) } });
    if (result.modifiedCount === 1) {
        res.status(200).json({ ok: true });
    } else {
        res.status(200).json({ ok: false, error: "fail to remove all access" });
    }
});

router.post("/access/list", async (req, res, next) => {
    const FObjectModel = mongoose.model("FObject");
    const UserModel = mongoose.model("User");
    let path = req.body.path.split("/")
    let name = path.slice(path.length - 1)[0]
    let vpath = "/"
    if (path.lenth > 2)
        vpath = path.slice(0, path.length - 1).join("/");
    let fitem = await FObjectModel.findOne({ owner: req.jwt.id, vpath, name });
    if (fitem != null) {
        let users = await UserModel.find({ _id: { "$in": fitem.access } });
        res.status(200).json({ ok: true, data: users.map(x => x.username) });
    } else
        res.status(200).json({ ok: false, error: "invallid path" });
});

router.post("/access/public", async (req, res, next) => {
    const FObjectModel = mongoose.model("FObject");
    const UserModel = mongoose.model("User");
    let path = req.body.path.split("/")
    let name = path.slice(path.length - 1)[0]
    let vpath = "/"
    if (path.lenth > 2)
        vpath = path.slice(0, path.length - 1).join("/");
    let fitem = await FObjectModel.findOne({ owner: req.jwt.id, vpath, name });
    if (fitem == null) {
        res.status(200).json({ ok: false, error: "invallid path" });
        return;
    }
    let result = await FObjectModel.updateOne({ owner: req.jwt.id, vpath, name }, { "$set": { public: !fitem.public } });
    if (result.modifiedCount === 1) {
        res.status(200).json({ ok: true, data: { public: !fitem.public, fid: fitem.fid } });
    } else {
        res.status(200).json({ ok: false, error: "fail to chagne public access" });
    }
});

async function getAllInVpath(path, id) {
    const FObjectModel = mongoose.model("FObject");
    let fitems = await FObjectModel.find({
        vpath: path,
        "$or": [
            { owner: id },
            { access: id }
        ]
    });
    let p = path.split("/")
    let tree = { path: path, child: [] }
    if (p.length > 2)
        tree.name = p[p.length - 1]
    for (let i in fitems) {
        x = fitems[i];
        if (x.ftype === FObject.types.Folder) {
            if (path === "/")
                tree.child.push(await getAllInVpath(path + x.name, id));
            else
                tree.child.push(await getAllInVpath(path + "/" + x.name, id));
        }
        else
            tree.child.push(await getAllInVpath(path + x.name, id));;
    }
    return tree;
}

router.post("/tree", async (req, res, next) => {
    let path = req.body.path ?? "/";
    let data = await getAllInVpath(path, req.jwt.id);
    res.status(200).json({ ok: true, data });
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
    fitems = await Promise.all(fitems.map(async (item)=>{
    	let ac = (await UserModel.find({_id:{"$in":item.access}})).map(x=>x.username)
	let new_item = {
	    ...item._doc,
	    access:ac
	};
	
	return new_item;
    }));
    res.status(200).json({ ok: true, data: fitems });
});

module.exports = router;
