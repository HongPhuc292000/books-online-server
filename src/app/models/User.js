const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema(
  {
    username: String,
    password: String,
    role: String,
    fullname: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", User);
