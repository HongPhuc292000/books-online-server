const express = require("express");
const router = express.Router();
const adminAuthController = require("../app/controllers/adminAuthController");
const middlewareController = require("../app/controllers/middlewareController");

router.post("/login", adminAuthController.login);
router.post("/refresh/:refreshToken", adminAuthController.refreshTokenRequest);
router.post(
  "/logout/:refreshToken",
  middlewareController.verifyToken,
  adminAuthController.logout
);
router.get(
  "/roles",
  middlewareController.verifyToken,
  adminAuthController.getAllRoles
);

module.exports = router;
