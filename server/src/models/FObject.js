const mongoose = require('mongoose');
const crypto = require("crypto");
const fs = require("fs");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const FobjectType = {
    File: 0,
    Folder: 1
}
const FObject = new Schema({
    name: { type: String, required: [true, "name required"] },
    fid: { type: String },
    hash: { type: String },
    ftype: { type: Number, required: [true, "ftype required"] },
    owner: { type: ObjectId, required: [true, "owner required"] },
    access: [{ type: ObjectId }],
    parent: { type: String, default: "/" },         /* it's foreign key to fid */
    public: { type: Boolean, defualt: false }
}, { timestamps: true });

FObject.methods = {
    generate_hash: function (filename) {
        let buffer = fs.readFileSync(`/data/${filename}`)
        let hash = crypto.createHash("sha256");
        hash.update(buffer);
        this.hash = hash.digest("hex");
    },
    check_hash: function (filename) {
        let buffer = fs.readFileSync(`/data/${filename}`)
        let hash = crypto.createHash("sha256");
        hash.update(buffer);
        return this.hash === hash.digest("hex");
    },
}

mongoose.model('FObject', FObject);
module.exports = {
    types: FobjectType
}