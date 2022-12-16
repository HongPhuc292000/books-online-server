const express = require("express");
const router = express.Router();
const authorController = require("../app/controllers/authorController");
const middleWareController = require("../app/controllers/middlewareController");
const roles = require("../app/constants/roles");

router.get("/:id", authorController.getDetailAuthor);
router.put("/:id", authorController.updateAuthor);
router.delete(
  "/:id",
  middleWareController.verifyToken,
  authorController.deleteAuthor
);
router.get(
  "/",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.SHOW_LIST_AUTHOR),
  authorController.getAllAuthor
);
router.post("/", authorController.addAuthor);

module.exports = router;
