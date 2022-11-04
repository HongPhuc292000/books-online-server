const authRouter = require("./auth");
const authorRouter = require("./author");
const bookRouter = require("./book");
const userRouter = require("./user");
const categoryRouter = require("./category");

function route(app) {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/author", authorRouter);
  app.use("/api/v1/book", bookRouter);
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/category", categoryRouter);
}

module.exports = route;
