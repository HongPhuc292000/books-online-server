const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  imageUrl: { type: mongoose.Schema.Types.ObjectId, ref: "images" },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "authors" },
  name: { type: String, require: true },
  view: Number,
  isFull: { type: Boolean, default: false },
  publisherId: { type: mongoose.Schema.Types.ObjectId, ref: "publishers" },
  amount: { type: Number, default: 0 },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "categories" }],
  content: { type: Object },
  currentFee: Number,
  preferentialFee: Number,
  categoryKeys: [String],
  bookCode: String,
  createdDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("books", bookSchema);
