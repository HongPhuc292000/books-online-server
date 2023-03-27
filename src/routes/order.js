const express = require("express");
const router = express.Router();
const orderController = require("../app/controllers/orderController");
const middleWareController = require("../app/controllers/middlewareController");

router.get("/:id", orderController.getDetailOrder);
router.put("/:id", orderController.editOrder);
router.post("/", orderController.addOrder);
router.get("/", orderController.getAllOrders);

module.exports = router;
