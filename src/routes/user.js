const express = require("express");
const router = express.Router();
const userController = require("../app/controllers/userController");
const middleWareController = require("../app/controllers/middlewareController");
const roles = require("../app/constants/roles");

router.delete(
  "/:id",
  middleWareController.verifyToken,
  userController.deleteUser
);
router.get(
  "/:id",
  middleWareController.verifyToken,
  userController.getDetailUser
);
router.get("/", middleWareController.verifyToken, userController.getAllUser);

module.exports = router;
