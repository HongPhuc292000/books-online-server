const mongoose = require("mongoose");
const statuses = require("../constants/status");
const Schema = mongoose.Schema;

const bookSchema = new Schema(
  {
    imageUrl: { type: String, require: true },
    name: { type: String, require: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "authors" },
    view: { type: Number, default: 0 },
    // isFull: { type: Boolean, default: false },
    amount: { type: Number, default: 0 },
    categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "categories" }],
    content: { type: Object },
    defaultPrice: { type: Number, require: true },
    reducedPrice: Number,
    bookCode: { type: String, require: true },
    status: { type: String, default: statuses.DISABLE },
    description: { type: String },
    saled: { type: Number, default: 0 },
    yearPublish: { type: Number },
    isDelete: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("books", bookSchema);
