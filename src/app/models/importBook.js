const mongoose = require("mongoose");
const statuses = require("../constants/status");
const Schema = mongoose.Schema;

const subProductSchema = new Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "books" },
    amount: { type: Number },
    bookCode: { type: String },
    imageUrl: { type: String },
    name: { type: String },
  },
  { _id: false }
);

const importBookSchema = new Schema(
  {
    orderCode: { type: String, require: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "members" },
    products: [subProductSchema],
    isCancel: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("importBooks", importBookSchema);
