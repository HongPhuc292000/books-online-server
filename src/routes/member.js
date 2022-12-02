const express = require("express");
const router = express.Router();
const memberController = require("../app/controllers/memberController");
const middleWareController = require("../app/controllers/middlewareController");

router.delete(
  "/:id",
  middleWareController.verifyToken,
  middleWareController.verifyRole,
  memberController.deleteMember
);
router.get(
  "/:id",
  middleWareController.verifyToken,
  memberController.getDetailMember
);
router.get(
  "/",
  middleWareController.verifyToken,
  memberController.getAllMember
);
router.post("/", memberController.addMember);

module.exports = router;
