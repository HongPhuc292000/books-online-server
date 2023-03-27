const mongoose = require("mongoose");
const statuses = require("../constants/status");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "books" },
        amount: Number,
        reducedPrices: Number,
        defaultPrices: Number,
      },
    ],
    status: { type: String },
    orderPrices: { type: Number },
    shipPrices: { type: Number },
    shipSalePrices: { type: Number },
    discountPrices: { type: Number },
    totalPrices: { type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("orders", orderSchema);
