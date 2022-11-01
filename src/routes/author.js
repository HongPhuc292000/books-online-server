const express = require("express");
const router = express.Router();
const authorController = require("../app/controllers/author/authorController");

router.post("/", authorController.addAuthor);
router.get("/", authorController.getAllAuthor);
router.get("/:id", authorController.getAuthor);
router.put("/:id", authorController.updateAuthor);

module.exports = router;
