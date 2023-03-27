const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema(
  {
    token: String,
  },
  { _id: false }
);

module.exports = mongoose.model("refreshtokens", refreshTokenSchema);
