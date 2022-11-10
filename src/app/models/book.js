const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  name: { type: String, require: true },
  publishedDate: { type: String },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "categories" }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: "authors" },
  bookImg: { type: mongoose.Schema.Types.ObjectId, ref: "images" },
});

module.exports = mongoose.model("books", bookSchema);
