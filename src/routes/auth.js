const express = require("express");
const authController = require("../app/controllers/auth/AuthController");
const router = express.Router();

router.post("/register", authController.register);
router.get("/login", authController.login);

module.exports = router;
