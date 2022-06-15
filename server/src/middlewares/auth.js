const jsonwebtoken = require("jsonwebtoken");
const ac = require("./../configs/access-controll.json")
const cfg = require("./../configs/config.json")

function verify(req, res, next) {
    let authenticated = false;
    if (req.headers.authorization) {
        try {
            let payload = jsonwebtoken.verify(req.headers.authorization, cfg.jwt_secret);
            req.jwt = {
                ...payload
            }
        } catch (e) {
            res.status(400);
            throw "invalid authorization header";
        }
        authenticated = true;
    }

    if (ac.paths.hasOwnProperty(req.path) && ac.paths[req.path].hasOwnProperty("roles")) {
        if (!authenticated) {
            res.status(401);
            throw "unauthorized";
        }
        else if (ac.paths[req.path].roles.indexOf(req.jwt.role) == -1) {
            res.status(403);
            throw "access denied";
        }
    }
    next();
}
module.exports = verify;