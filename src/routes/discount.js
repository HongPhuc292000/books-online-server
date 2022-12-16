const express = require("express");
const router = express.Router();
const discountController = require("../app/controllers/discountController");
const middleWareController = require("../app/controllers/middlewareController");
const roles = require("../app/constants/roles");

router.get("/:id", discountController.getDetailDiscount);
router.put("/:id", discountController.editDiscount);
router.delete("/:id", discountController.deleteDiscount);
router.get("/", discountController.getAllDiscounts);
router.post("/", discountController.addDiscount);

module.exports = router;
