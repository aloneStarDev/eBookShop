const express = require("express");
const validate_password = require("../utils/password-validator");
const cfg = require("../configs/config.json");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const FObject = require("../models/FObject");
const multer = require('multer');
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
    for (let f in req.files) {
        let file = FObjectModel({
            ftype: FObject.types.File,
            fid: req.files[f].filename,
            owner: req.jwt.id,
            name: req.files[f].originalname,
            ...req.body
        });
        file.generate_hash(req.files[f].filename);
        await file.save();
    }
    res.status(200).json({ ok: true });
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
// router.post("/remove", async (req, res, next) => {
//     const FObjectModel = mongoose.model("FObject");
    
//     FObjectModel.find({ name: req.body.name });
// });
router.post("/tree", async (req, res, next) => {
    const FObjectModel = mongoose.model("FObject");
    let fitems = await FObjectModel.find({
        "$or": [
            { owner: req.jwt.id },
            { access: req.jwt.id }
        ]
    });
    res.status(200).json({ ok: true, data: fitems });
});
module.exports = router;