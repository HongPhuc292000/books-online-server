const express = require("express");
const router = express.Router();
const memberController = require("../app/controllers/memberController");
const middleWareController = require("../app/controllers/middlewareController");

router.get(
  "/:id",
  middleWareController.verifyToken,
  middleWareController.verifyProfile,
  memberController.getDetailMember
);
router.put("/:id", memberController.editMember);

module.exports = router;
