const express = require("express");
const router = express.Router();
const categoryController = require("../app/controllers/categoryController");
const middleWareController = require("../app/controllers/middlewareController");

// router.get("/:id", categoryController.getDetailBook);
// router.put("/:id", categoryController.updateBook);
// router.delete(
//   "/:id",
//   middleWareController.verifyToken,
//   middleWareController.verifyRole,
//   categoryController.deleteBook
// );
router.post("/", categoryController.addCategory);
// router.get("/", categoryController.getAllBooks);

module.exports = router;
