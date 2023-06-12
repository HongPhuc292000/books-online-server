const express = require("express");
const router = express.Router();
const bookController = require("../app/controllers/bookController");
const middleWareController = require("../app/controllers/middlewareController");
const roles = require("../app/constants/roles");

router.get("/allBooksForOrder", bookController.getAllBooksForOrder);
router.get("/:id", bookController.getDetailBook);
router.put(
  "/:id",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.EDIT_BOOK),
  bookController.editBook
);
router.delete(
  "/:id",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.DELETE_BOOK),
  bookController.deleteBook
);
router.post(
  "/",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.ADD_BOOK),
  bookController.addBook
);
router.get("/", bookController.getAllBooks);

module.exports = router;
