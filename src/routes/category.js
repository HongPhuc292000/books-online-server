const express = require("express");
const router = express.Router();
const categoryController = require("../app/controllers/categoryController");
const middleWareController = require("../app/controllers/middlewareController");

router.get("/allCategories", categoryController.getCategoryToSelect);
router.delete(
  "/:id",
  middleWareController.verifyToken,
  categoryController.deleteCategory
);
router.post("/", categoryController.addCategory);
router.get("/", categoryController.getAllCategories);

module.exports = router;
