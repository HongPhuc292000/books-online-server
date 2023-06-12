const express = require("express");
const router = express.Router();
const discountController = require("../app/controllers/discountController");
const middleWareController = require("../app/controllers/middlewareController");
const roles = require("../app/constants/roles");

router.get("/:id", discountController.getDetailDiscount);
router.put(
  "/:id",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.EDIT_DISCOUNT),
  discountController.editDiscount
);
router.delete(
  "/:id",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.DELETE_DISCOUNT),
  discountController.deleteDiscount
);
router.get("/", discountController.getAllDiscounts);
router.post(
  "/",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.ADD_DISCOUNT),
  discountController.addDiscount
);

module.exports = router;
