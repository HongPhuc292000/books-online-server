const mongoose = require("mongoose");
const genders = require("../constants/gender");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    imageUrl: { type: String, default: "" },
    username: String,
    password: String,
    fullname: String,
    email: String,
    phoneNumber: String,
    gender: { type: String, default: genders.OTHER },
    birthday: String,
    isDelete: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", userSchema);
