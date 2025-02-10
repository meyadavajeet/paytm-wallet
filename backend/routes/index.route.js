// backend/index.js
const express = require("express");
const userRouter = require("../routes/user.route");
const accountRouter = require("../routes/account.routes")

const router = express.Router();

router.use("/user", userRouter)
router.use("/account", accountRouter)

module.exports = router;


