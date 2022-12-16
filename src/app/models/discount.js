const mongoose = require("mongoose");
const discountTypes = require("../constants/discountTypes");
const Schema = mongoose.Schema;

const discountSchema = new Schema({
  code: { type: String, require: true },
  type: { type: String, default: discountTypes.PERCENT },
  value: { type: Number, require: true },
  amount: { type: Number, default: 0 },
  used: { type: Number, default: 0 },
});

module.exports = mongoose.model("discounts", discountSchema);
