const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  type: String,
  name: String,
});

module.exports = mongoose.model("categories", categorySchema);
