const express = require("express");
const router = express.Router();
const authController = require("../app/controllers/authController");
const middlewareController = require("../app/controllers/middlewareController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshTokenRequest);
router.post("/logout", middlewareController.verifyToken, authController.logout);

module.exports = router;
