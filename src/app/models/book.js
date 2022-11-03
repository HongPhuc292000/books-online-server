const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  name: { type: String, require: true },
  publishedDate: { type: String },
  generes: [String],
  author: { type: mongoose.Schema.Types.ObjectId, ref: "author" },
});

module.exports = mongoose.model("books", bookSchema);
