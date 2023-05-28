const express = require("express");
const router = express.Router();
const userController = require("../app/controllers/userController");
const middleWareController = require("../app/controllers/middlewareController");
const roles = require("../app/constants/roles");

router.delete("/:id", userController.deleteUser);
router.get("/:id", userController.getDetailUser);
router.put("/:id", userController.editUser);
router.get("/", userController.getAllUsers);
router.post("/", userController.addUser);
module.exports = router;
