const express = require("express");
const router = express.Router();
const userController = require("../app/controllers/userController");
const middleWareController = require("../app/controllers/middlewareController");
const roles = require("../app/constants/roles");

router.delete(
  "/:id",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.DELETE_CUSTOMER),
  userController.deleteUser
);
router.get(
  "/:id",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.EDIT_CUSTOMER),
  userController.getDetailUser
);
router.put(
  "/:id",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.EDIT_CUSTOMER),
  userController.editUser
);
router.get(
  "/",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.SHOW_LIST_CUSTOMER),
  userController.getAllUsers
);
router.post(
  "/",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.ADD_CUSTOMER),
  userController.addUser
);
module.exports = router;
