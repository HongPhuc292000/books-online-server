const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: String,
    password: String,
    role: String,
    fullname: String,
    email: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", userSchema);
