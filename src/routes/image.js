const express = require("express");
const multer = require("multer");
const router = express.Router();
const imageController = require("../app/controllers/imageController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/upload",
  upload.single("avatarImg"),
  imageController.uploadSingle
);

module.exports = router;
