const express = require("express");
const router = express.Router();
const categoryController = require("../app/controllers/categoryController");
const middleWareController = require("../app/controllers/middlewareController");

router.delete(
  "/:id",
  middleWareController.verifyToken,
  middleWareController.verifyRole,
  categoryController.deleteCategory
);
router.post("/", categoryController.addCategory);
router.get("/", categoryController.getAllCategories);

module.exports = router;
