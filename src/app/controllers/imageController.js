const fs = require("fs");
const Image = require("../models/image");

const imageController = {
  uploadSingle: async (req, res) => {
    try {
      const newImage = new Image({
        name: req.body.name,
        img: {
          data: fs.readFileSync("uploads/" + req.file.filename),
          contentType: "image/png",
        },
      });
      const savedImage = await newImage.save();
      res.status(200).json(savedImage.img.data);
    } catch {
      res.status(500).json("server_error");
    }
  },
};

module.exports = imageController;
