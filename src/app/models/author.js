const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authorSchema = new Schema({
  name: { type: String, require: true },
  yearOfBirth: { type: String },
  yearPassed: { type: String },
  description: { type: String },
});

module.exports = mongoose.model("authors", authorSchema);
