const mongoose = require('mongoose');
const email_validator = require('../utils/email-validator');
const password_validator = require("../utils/password-validator");
const { send_code } = require("../services/emailService");
const crypto = require("crypto");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Roles = {
    USER: 0,
    ADMIN: 1,
    MASTER: 2
}

const UserSchema = new Schema({
    name: { type: String, required: [true, "name required"] },
    username: { type: String, required: [true, "username required"], unique: true },
    password: { type: String, required: [true, "password required"] },
    email: { type: String, required: [true, "email required"], unique: true, validate: email_validator },
    verify: { type: Boolean, default: false },
    code: { type: String },
    role: { type: Number, default: Roles.USER}
});

UserSchema.methods = {
    check_password: function (password) {
        let hash = crypto.createHash("sha256")
        hash.update(password);
        password = hash.digest("hex");
        return password === this.password;
    },
    verify_email: function (code) {
        if (!this.verify && this.hasOwnProperty("code") && this.code === code) {
            delete this.code;
            this.verify = true;
            this.save({ validateBeforeSave: false });
        }
    },
    send_verification_code: async function () {
        try {
            this.code = await send_code(this.email);
            await this.save({ validateBeforeSave: false });
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
}
mongoose.model('User', UserSchema);
module.exports = {
    Roles
}