const mongoose = require("mongoose");
const discountTypes = require("../constants/discountTypes");
const discountFor = require("../constants/discountFor");
const Schema = mongoose.Schema;

const discountSchema = new Schema({
  code: { type: String, require: true },
  description: { type: String, require: true },
  type: { type: String, default: discountTypes.PERCENT },
  discountFor: { type: String, default: discountFor.ORDER },
  value: { type: Number, require: true },
  amount: { type: Number, default: 0 },
  used: { type: Number, default: 0 },
  exp: { type: Number },
  enable: { type: Boolean, default: false },
  isDelete: { type: Number, default: 0 },
});

module.exports = mongoose.model("discounts", discountSchema);
