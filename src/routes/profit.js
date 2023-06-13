const express = require("express");
const router = express.Router();
const profitController = require("../app/controllers/profitController");
const middleWareController = require("../app/controllers/middlewareController");
const roles = require("../app/constants/roles");
const middlewareController = require("../app/controllers/middlewareController");

router.get(
  "/month",
  middleWareController.verifyToken,
  middlewareController.verifyRoles(roles.MANAGE_SALES_FIGURES),
  profitController.getProfitPerMonth
);

router.get(
  "/eachMonth",
  middleWareController.verifyToken,
  middlewareController.verifyRoles(roles.MANAGE_SALES_FIGURES),
  profitController.getProfitEachMonth
);

router.get(
  "/year",
  middleWareController.verifyToken,
  middlewareController.verifyRoles(roles.MANAGE_SALES_FIGURES),
  profitController.getProfitPerYear
);

router.get(
  "/eachYear",
  middleWareController.verifyToken,
  middlewareController.verifyRoles(roles.MANAGE_SALES_FIGURES),
  profitController.getProfitEachYear
);

module.exports = router;
