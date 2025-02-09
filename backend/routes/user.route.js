const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

module.exports = router;

router.post("/signup", userController.signup)
router.post("/signin", userController.signIn)

// authorized routes
router.put("/update", authMiddleware, userController.updateUserInfo)
router.get("/get", authMiddleware, userController.getUserInfo)
router.get("/search", authMiddleware, userController.filterUser