const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URL, () => {
      console.log("Connect success!!");
    });
  } catch (error) {
    console.log("Connect failure!!");
  }
}

module.exports = { connect };
