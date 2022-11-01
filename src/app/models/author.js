const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authorSchema = new Schema({
  name: { type: String, require: true },
  birthday: { type: Number },
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: "books" }],
});

module.exports = mongoose.model("author", authorSchema);
