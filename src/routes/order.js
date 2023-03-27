const express = require("express");
const router = express.Router();
const orderController = require("../app/controllers/orderController");
const middleWareController = require("../app/controllers/middlewareController");

// router.get("/:id", orderController.getDetailBook);
// router.put("/:id", orderController.editBook);
// router.delete(
//   "/:id",
//   // middleWareController.verifyToken,
//   orderController.deleteBook
// );
router.post("/", orderController.addOrder);
router.get("/", orderController.getAllOrders);

module.exports = router;
