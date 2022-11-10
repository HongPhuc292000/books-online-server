const express = require("express");
const router = express.Router();
const authController = require("../app/controllers/authController");
const middlewareController = require("../app/controllers/middlewareController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh/:refreshToken", authController.refreshTokenRequest);
router.post(
  "/logout/:refreshToken",
  middlewareController.verifyToken,
  authController.logout
);

module.exports = router;
