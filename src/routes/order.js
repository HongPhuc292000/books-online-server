const express = require("express");
const router = express.Router();
const orderController = require("../app/controllers/orderController");
const middleWareController = require("../app/controllers/middlewareController");
const roles = require("../app/constants/roles");

router.get(
  "/:id",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.EDIT_ORDER),
  orderController.getDetailOrder
);
router.put(
  "/:id",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.EDIT_ORDER),
  orderController.editOrder
);
router.delete(
  "/:id",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.DELETE_ORDER),
  orderController.deleteOrder
);
router.post(
  "/",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.ADD_ORDER),
  orderController.addOrder
);
router.get(
  "/",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.SHOW_LIST_ORDER),
  orderController.getAllOrders
);

module.exports = router;
