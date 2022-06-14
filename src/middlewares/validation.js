const ac = require("./../configs/access-controll.json");

function validate(req, res, next) {
    if (ac.paths.hasOwnProperty(req.path) && ac.paths[req.path].hasOwnProperty("parameter")) {
        let params = ac.paths[req.path].parameter;
        let body = req.body;
        for (let k in body) {
            if (params.hasOwnProperty(k)) {
                if (params[k].hasOwnProperty("type")) {
                    if (params[k].type.startsWith("array")) {
                        let valid_each_item = true;
                        if (!Array.isArray(body[k])) {
                            res.status(403);
                            throw `invalid type for ${k}: must be ${params[k].type}`;
                        } else {
                            if (params[k].type.includes(".")) {
                                let subtype = params[k].type.split(".")
                                body[k].forEach(index => {
                                    if (typeof (index) !== subtype[1]){
                                        res.status(403);
                                        throw `invalid type for ${k} in ${index}: must be ${params[k].type}`;
                                    }
                                })
                            }else{
                                console.error("invalid role for access-control in "+k);
                            }
                        }

                    } else if (typeof (body[k]) !== params[k].type) {
                        res.status(403);
                        throw `invalid type for ${k}: must be ${params[k].type}`;
                    }
                }
            } else {
                res.status(403);
                throw `Forbidden - invalid paramter ${k}`;
            }
        }
        for (let x in params) {
            if (params[x].required && !body.hasOwnProperty(x)) {
                res.status(403);
                throw `${x} is required`
            }
        }
    }
    next();
}
module.exports = validate;