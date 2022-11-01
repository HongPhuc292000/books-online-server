const express = require("express");
const router = express.Router();
const userController = require("../app/controllers/userController");
const middleWareController = require("../app/controllers/middlewareController");

router.get("/", middleWareController.verifyToken, userController.getAllUser);
router.delete(
  "/:id",
  middleWareController.verifyToken,
  middleWareController.verifyRole,
  userController.deleteUser
);

module.exports = router;
