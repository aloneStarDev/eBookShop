const express = require("express");
const userRouter = require("./user");
const fileRouter = require("./fobject");
const adminRouter = require("./admin");
const panelRouter = require("./panel");

const router = express.Router();

router.use("/api/user", userRouter);
router.use("/api/fobject", fileRouter);
router.use("/api/admin", adminRouter);
router.use("/api/panel", panelRouter);
module.exports = router;