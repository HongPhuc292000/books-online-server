const mongoose = require("mongoose");
const statuses = require("../constants/status");
const Schema = mongoose.Schema;

const subOrderSchema = new Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "books" },
    amount: { type: Number },
    bookCode: { type: String },
    reducedPrices: { type: Number },
    defaultPrices: { type: Number },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    customerName: { type: String },
    phoneNumber: { type: String },
    products: [subOrderSchema],
    status: { type: String },
    orderPrices: { type: Number },
    shipPrices: { type: Number },
    shipDiscountPrices: { type: Number },
    orderDiscountPrices: { type: Number },
    totalPrices: { type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("orders", orderSchema);
