const express = require("express");
const router = express.Router();
const memberController = require("../app/controllers/memberController");
const middleWareController = require("../app/controllers/middlewareController");
const roles = require("../app/constants/roles");

router.delete(
  "/:id",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.DELETE_MEMBER),
  memberController.deleteMember
);
router.get(
  "/:id",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.EDIT_MEMBER),
  memberController.getDetailMember
);
router.put(
  "/:id",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.EDIT_MEMBER),
  memberController.editMember
);
router.get(
  "/",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.SHOW_LIST_MEMBER),
  memberController.getAllMember
);
router.post(
  "/",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.ADD_MEMBER),
  memberController.addMember
);

module.exports = router;
