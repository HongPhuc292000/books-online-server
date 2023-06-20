const express = require("express");
const router = express.Router();
const memberController = require("../app/controllers/memberController");
const customerController = require("../app/controllers/userController");
const middleWareController = require("../app/controllers/middlewareController");
const userController = require("../app/controllers/userController");

router.get(
  "/:id",
  middleWareController.verifyToken,
  middleWareController.verifyProfile,
  memberController.getDetailMember
);
router.put(
  "/:id",
  middleWareController.verifyToken,
  middleWareController.verifyProfile,
  memberController.editMember
);

router.get(
  "/customer/:id",
  middleWareController.verifyToken,
  middleWareController.verifyProfile,
  userController.getDetailUser
);
router.put(
  "/customer/:id",
  middleWareController.verifyToken,
  middleWareController.verifyProfile,
  userController.editUser
);

module.exports = router;
