const express = require("express");
const router = express.Router();
const authorController = require("../app/controllers/author/authorController");

router.get("/:id", authorController.getAuthor);
router.put("/:id", authorController.updateAuthor);
router.get("/", authorController.getAllAuthor);
router.post("/", authorController.addAuthor);

module.exports = router;
