const express = require("express");
const router = express.Router();
const bookController = require("../app/controllers/book/bookController");

router.post("/", bookController.addBook);
router.get("/", bookController.getAllBooks);
router.get("/:id", bookController.getBook);
router.put("/:id", bookController.updateBook);
router.delete("/:id", bookController.deleteBook);

module.exports = router;
