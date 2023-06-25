const express = require("express");
const router = express.Router();
const importBookController = require("../app/controllers/importBookController");
const middleWareController = require("../app/controllers/middlewareController");
const roles = require("../app/constants/roles");

router.get("/:id", importBookController.getDetailImportBook);
router.put(
  "/:id",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.EDIT_IMPORT_BOOK),
  importBookController.updateStatusImportBook
);
// router.delete(
//   "/:id",
//   middleWareController.verifyToken,
//   middleWareController.verifyRoles(roles.DELETE_BOOK),
//   importBookController.deleteBook
// );
router.post(
  "/",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.ADD_IMPORT_BOOK),
  importBookController.addImportBook
);
router.get(
  "/",
  middleWareController.verifyToken,
  middleWareController.verifyRoles(roles.SHOW_LIST_IMPORT_BOOK),
  importBookController.getAllImportBooks
);

module.exports = router;
