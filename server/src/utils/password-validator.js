const fs = require("fs");
const path = require("path");
const { isAsyncFunction } = require("util/types");
const password_validator = [
    {
        validator: (password) => {
            return /(?=.*[A-Z].*)/.test(password);
        },
        message: 'password must contain at least one of A-Z character'
    },{
        validator: (password) => {
            return /(?=.*[!@#$&*_+-].*)/.test(password);
        },
        message: "password must contain at least one of '!@#$&*_+-' character"
    },{
        validator: (password) => {
            return /(?=.*[a-z].*)/.test(password);
        },
        message: 'password must contain at least one of a-z character'
    },{
        validator: (password) => {
            return /(?=.*[0-9].*)/.test(password);
        },
        message:'password must contain at least one of 0-9 character'
    },
    {
        validator: (password) => {
            return /.{8,12}/.test(password);
        },
        message:'password length must be in 8-12 range!'
    },
    {
        validator: (password) => {
            /*
	    let weak_passwords = fs.readFileSync(path.join(__dirname,'../','./configs/rock-you.txt'),{encoding:"utf8"}).toString().split("\n");
            let k = weak_passwords.filter(x=>{
                return x.indexOf(password) !== -1;
            });
            if(k.length == 0)
                return true;
            return false;
	    */
	    return true
        },
        message:'your password is weak'
    },
];
function validate_all(password){
    for(let i in password_validator){
        if(!password_validator[i].validator(password))
            throw password_validator[i].message;
    };
}
module.exports = validate_all;
