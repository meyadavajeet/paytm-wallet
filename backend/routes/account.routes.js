const express = require('express');
const router = express.Router();
const accountController = require("../controllers/account.controller");

module.exports = router;

router.get("/balance", accountController.getAccountBalance)
router.post("/transfer", accountController.transferMoney)
