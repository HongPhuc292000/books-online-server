const express = require("express");
const router = express.Router();
const bookController = require("../app/controllers/bookController");
const middleWareController = require("../app/controllers/middlewareController");

router.get("/allBooksForOrder", bookController.getAllBooksForOrder);
router.get("/:id", bookController.getDetailBook);
router.put("/:id", bookController.editBook);
router.delete(
  "/:id",
  // middleWareController.verifyToken,
  bookController.deleteBook
);
router.post("/", bookController.addBook);
router.get("/", bookController.getAllBooks);

module.exports = router;
