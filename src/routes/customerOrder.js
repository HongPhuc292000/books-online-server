const express = require("express");
const router = express.Router();
const customerOrderController = require("../app/controllers/customerOrderController");
const middleWareController = require("../app/controllers/middlewareController");

router.get(
  "/incart/:id",
  middleWareController.verifyToken,
  customerOrderController.getDetailInCartOrder
);
router.post(
  "/removeProduct",
  middleWareController.verifyToken,
  customerOrderController.removeProductIncart
);

router.put(
  "/cod/:id",
  middleWareController.verifyToken,
  customerOrderController.checkoutOffline
);

router.post(
  "/checkoutOnline",
  middleWareController.verifyToken,
  customerOrderController.checkoutOnline
);

router.put(
  "/checkoutSuccess/:id",
  middleWareController.verifyToken,
  customerOrderController.checkoutOnlineSuccess
);

router.post(
  "/",
  middleWareController.verifyToken,
  customerOrderController.addProductTocart
);
router.put(
  "/cancelOrder/:id",
  middleWareController.verifyToken,
  customerOrderController.cancelOrder
);
router.get(
  "/:id",
  middleWareController.verifyToken,
  customerOrderController.getDetailOrder
);
router.get(
  "/",
  middleWareController.verifyToken,
  customerOrderController.getAllOrders
);

module.exports = router;
