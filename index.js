const express = require("express");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./src/config/db");
const route = require("./src/routes");

dotenv.config();

const PORT = 3001;
const app = express();

db.connect();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(morgan("common"));

route(app);

app.listen(process.env.PORT || PORT, () => {
  console.log("Server is running...");
});
