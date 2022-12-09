const express = require("express");
const router = express.Router();
const authorController = require("../app/controllers/authorController");
const middleWareController = require("../app/controllers/middlewareController");

router.get("/:id", authorController.getDetailAuthor);
router.put("/:id", authorController.updateAuthor);
router.delete(
  "/:id",
  middleWareController.verifyToken,
  authorController.deleteAuthor
);
router.get("/", authorController.getAllAuthor);
router.post("/", authorController.addAuthor);

module.exports = router;
