const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authorSchema = new Schema({
  name: { type: String, require: true },
  yearOfBirth: { type: Number },
  yearPassed: { type: Number },
  description: { type: String },
});

module.exports = mongoose.model("authors", authorSchema);
