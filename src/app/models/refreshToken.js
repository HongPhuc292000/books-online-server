const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema({
  token: String,
});

module.exports = mongoose.model("refreshtokens", refreshTokenSchema);
