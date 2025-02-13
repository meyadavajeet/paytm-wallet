const express = require('express');
const router = express.Router();
const accountController = require("../controllers/account.controller");
const { authMiddleware } = require('../middlewares/auth.middleware');

module.exports = router;

router.get("/balance", authMiddleware, accountController.getAccountBalance)
router.post("/transfer", authMiddleware, accountController.transferMoney)
