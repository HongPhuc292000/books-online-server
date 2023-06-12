const express = require("express");
const router = express.Router();
const categoryController = require("../app/controllers/categoryController");
const middleWareController = require("../app/controllers/middlewareController");
const roles = require("../app/constants/roles");

router.get("/allCategories", categoryController.getCategoryToSelect);
router.delete(
  "/:id",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.DELETE_CATEGORY),
  categoryController.deleteCategory
);
router.post(
  "/",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.ADD_CATEGORY),
  categoryController.addCategory
);
router.get("/", categoryController.getAllCategories);

module.exports = router;
