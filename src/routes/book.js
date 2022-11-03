const express = require("express");
const router = express.Router();
const bookController = require("../app/controllers/book/bookController");

router.get("/:id", bookController.getBook);
router.put("/:id", bookController.updateBook);
router.delete("/:id", bookController.deleteBook);
router.post("/", bookController.addBook);
router.get("/", bookController.getAllBooks);

module.exports = router;
