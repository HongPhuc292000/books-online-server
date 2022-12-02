const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  key: String,
  name: String,
});

module.exports = mongoose.model("categories", categorySchema);
