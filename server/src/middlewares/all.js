const express = require("express");
const auth = require("./auth");
const validation = require("./validation");
const router = express.Router();
router.use(auth);
router.use(validation);
module.exports = router;