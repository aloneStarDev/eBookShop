const express = require("express");
const jsonwebtoken = require("jsonwebtoken");
const { verify } = require("jsonwebtoken");
const cfg = require("../configs/config.json");
const mongoose = require("mongoose");
const crypto = require("crypto");
const router = express.Router();

router.post("/register", async (req, res, next) => {
    const User = mongoose.model("User");
    let user = new User(req.body);
    try {
        await user.save();
        user.send_verification_code();
        res.status(201).json({ ok: true, msg: "please verify your email address" });
    } catch (err) {
        res.status(400);
        if (err.message.indexOf('duplicate key error') != -1) {
            if (err.message.indexOf("username") != -1)
                next("this username already exist");
            else if (err.message.indexOf("email") != -1)
                next("this email already exist");
        }
        else
            next(err.message);
    }
});

router.post("/verify", async (req, res, next) => {
    const User = mongoose.model("User");
    let result = await User.updateOne({ username: req.body.username, code: req.body.code }, { verify: true, "$unset": { code: "" } });
    if (result.acknowledged && result.modifiedCount === 1)
        res.status(200).json({ ok: true });
    else {
        res.status(400);
        next("invalid verification code");
    }
});

router.post("/add", async (req, res, next) => {
    const User = mongoose.model("User");
    let user = new User(req.body);
    try {
        await user.save();
        res.status(201).json({ ok: true });
    } catch (err) {
        res.status(400);
        if (err.message.indexOf('duplicate key error') != -1) {
            if (err.message.indexOf("username") != -1)
                next("this username already exist");
            else if (err.message.indexOf("email") != -1)
                next("this email already exist");
        }
        else
            next(err.message);
    }
});


router.post("/remove", async (req, res, next) => {
    const User = mongoose.model("User");
    let result = await User.deleteMany({ "username": { "$in": req.body.usernames } });
    if (result.acknowledged && result.deletedCount === req.body.usernames.length)
        res.status(200).json({ ok: true });
    else if (result.deletedCount != 0) {
        res.status(500).json({ ok: false, error: "fail to delete all items" })
    } else {
        res.status(400);
        next("invalid verification code");
    }
});

router.post("/login", async (req, res, next) => {
    const User = mongoose.model("User");
    let sha256 = crypto.createHash("sha256");
    sha256.update(req.body.password);
    req.body.password = sha256.digest("hex");
    let user = await User.findOne(req.body,);
    if (user == null) {
        res.status(401);
        next("invalid username or password");
    } else {
        jwt = jsonwebtoken.sign({ role: user.role, email: user.email, username: user.username }, cfg.jwt_secret, { expiresIn: "2d" });
        res.status(200).json({ ok: true, data: jwt })
    }
});

router.patch("/edit", async (req, res, next) => {
    const User = mongoose.model("User");
    let uid = req.body.uid ?? req.jwt.username;
    if (req.jwt.role === 2 || req.jwt.username === uid) {
        delete req.body.uid;
        try {
            if (req.body.hasOwnProperty("password")) {
                let sha256 = crypto.createHash("sha256");
                sha256.update(req.body.password);
                req.body.password = sha256.digest("hex");
            }
            if (req.body.hasOwnProperty("role") && req.jwt.role !== 2) {
                res.status(403);
                next("access denied");
                return;
            }

            let result = await User.updateOne({ username: uid }, req.body, { runValidators: true });
            if (result.acknowledged) {
                if (result.modifiedCount === 1) {
                    res.status(200).json({ ok: true });
                } else if (result.matchedCount === 1) {
                    res.status(400);
                    next({ ok: false, error: "no change detected" });
                }
            }
            else {
                res.status(200).json({ ok: false, error: "validion error" });
            }
        } catch (err) {
            res.status(400);
            if (err.message.indexOf('duplicate key error') != -1) {
                if (err.message.indexOf("username") != -1)
                    next("this username already exist");
                else if (err.message.indexOf("email") != -1)
                    next("this email already exist");
            }
            else
                next(err.message);
        }
    } else {
        res.status(403);
        next("access denied - you only can edit your profile");
    }
});

module.exports = router;