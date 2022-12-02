const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    imageUrl: { type: mongoose.Schema.Types.ObjectId, ref: "images" },
    username: String,
    password: String,
    fullname: String,
    email: String,
    phoneNumber: String,
    gender: String,
    birthday: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", userSchema);
