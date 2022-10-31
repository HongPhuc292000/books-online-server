const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const db = require("./src/config/db");
const route = require("./src/routes");

const PORT = 3001;
const app = express();

db.connect();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

route(app);

app.listen(process.env.PORT || PORT, () => {
  console.log("Server is running");
});
