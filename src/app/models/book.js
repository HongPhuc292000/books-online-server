const mongoose = require("mongoose");
const statuses = require("../constants/status");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  imageUrl: { type: String, require: true },
  name: { type: String, require: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "authors" },
  view: { type: Number, default: 0 },
  isFull: { type: Boolean, default: false },
  publisherId: { type: mongoose.Schema.Types.ObjectId, ref: "publishers" },
  amount: { type: Number, default: 0 },
  categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "categories" }],
  content: { type: Object },
  defaultPrice: { type: Number, require: true },
  reducedPrice: Number,
  bookCode: { type: String, require: true },
  status: { type: String, default: statuses.DISABLE },
  createdAt: { type: Date, default: new Date() },
});

module.exports = mongoose.model("books", bookSchema);
