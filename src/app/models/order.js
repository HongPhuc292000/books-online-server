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
      },
    ],

    reducedPrice: Number,
    status: { type: String },
    orderPrices: { type: Number },
    totalPrices: { type: Number },
    shipPrice: { type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("orders", orderSchema);
