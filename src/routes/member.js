const express = require("express");
const router = express.Router();
const memberController = require("../app/controllers/memberController");
const middleWareController = require("../app/controllers/middlewareController");
const roles = require("../app/constants/roles");

router.delete("/:id", memberController.deleteMember);
router.get(
  "/:id",
  middleWareController.verifyToken,
  memberController.getDetailMember
);
router.put("/:id", memberController.editMember);
router.get("/", memberController.getAllMember);
router.post(
  "/",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.ADD_MEMBER),
  memberController.addMember
);

module.exports = router;
