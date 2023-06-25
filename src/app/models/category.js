const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  type: String,
  name: String,
  isDelete: { type: Number, default: 0 },
});

module.exports = mongoose.model("categories", categorySchema);
