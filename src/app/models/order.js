const mongoose = require("mongoose");
const orderStatuses = require("../constants/orderStatus");
const Schema = mongoose.Schema;

const paymentTypeConst = {
  ONLINE: "ONLINE",
  CASH: "CASH",
};

const subOrderSchema = new Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "books" },
    amount: { type: Number },
    bookCode: { type: String },
    reducedPrice: { type: Number },
    defaultPrice: { type: Number },
    imageUrl: { type: String },
    name: { type: String },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    orderCode: { type: String },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    customerName: { type: String },
    customerPhoneNumber: { type: String },
    customerAddress: { type: String },
    paymentType: { type: String, default: paymentTypeConst.CASH },
    products: [subOrderSchema],
    status: { type: String, default: orderStatuses.INCART },
    orderPrices: { type: Number },
    shipPrices: { type: Number },
    shipDiscountPrices: { type: Number },
    orderDiscountId: { type: mongoose.Schema.Types.ObjectId, ref: "discount" },
    orderDiscountPrices: { type: Number },
    totalPrices: { type: Number },
    checkout: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("orders", orderSchema);
