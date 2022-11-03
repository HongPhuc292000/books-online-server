const express = require("express");
const router = express.Router();
const userController = require("../app/controllers/userController");
const middleWareController = require("../app/controllers/middlewareController");

router.delete(
  "/:id",
  middleWareController.verifyToken,
  middleWareController.verifyRole,
  userController.deleteUser
);
router.get("/", middleWareController.verifyToken, userController.getAllUser);

module.exports = router;
