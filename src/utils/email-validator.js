const fs = require("fs");
const path = require("path");
const email_validator = [
    {
        validator: (email) => {
            return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
        },
        message: props => `invalid email adress`
    },
    {
        validator: (email) => {
            let disposable_emails = fs.readFileSync(path.join(__dirname,'../','./configs/disposable-email.txt'),{encoding:"utf8"}).toString().split("\n");
            let k = disposable_emails.filter(x=>{
                return email.endsWith(x);
            });
            if(k.length == 0)
                return true;
            return false;
        },
        message: props => `your email is a disposable email`
    }
    
]
module.exports = email_validator;