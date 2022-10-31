const mongoose = require("mongoose");
async function connect() {
  try {
    await mongoose.connect("mongodb://localhost:27017/books_online");
    console.log("connect success!!");
  } catch (error) {
    console.log("connect failure!!");
  }
}

module.exports = { connect };
