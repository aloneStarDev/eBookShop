const nodemailer = require("nodemailer");
const crypto = require("crypto");
const config = require("../configs/config.json");

const transporter = nodemailer.createTransport(config.smtp_server);

async function send_code(to) {
    let code = "";
    for (let i = 0; i < 8; i++) {
        code += crypto.randomInt(0, 10)
    }
    let info = await transporter.sendMail({
        from: `eShop ${config.smtp_server.auth.user}`,
        to,
        subject: "eBookShop - verify",
        html: `please verify your email<br/> <h1>${code}</h1>`,
    });
    console.log(info.messageId);
    return code;
}

module.exports = {
    send_code
}