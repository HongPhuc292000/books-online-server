const express = require("express");
const router = express.Router();
const authorController = require("../app/controllers/authorController");
const middleWareController = require("../app/controllers/middlewareController");
const roles = require("../app/constants/roles");

router.get(
  "/allAuthors",
  middleWareController.verifyToken,
  authorController.getAuthorToSelect
);
router.get(
  "/:id",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.EDIT_AUTHOR),
  authorController.getDetailAuthor
);
router.put(
  "/:id",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.EDIT_AUTHOR),
  authorController.updateAuthor
);
router.delete(
  "/:id",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.DELETE_AUTHOR),
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
