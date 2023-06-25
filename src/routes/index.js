const authRouter = require("./auth");
const authorRouter = require("./author");
const bookRouter = require("./book");
const userRouter = require("./user");
const memberRouter = require("./member");
const profileRouter = require("./profile");
const categoryRouter = require("./category");
const adminAuthRouter = require("./adminAuth");
const discountRouter = require("./discount");
const orderRouter = require("./order");
const customerOrderRouter = require("./customerOrder");
const profitRouter = require("./profit");
const importBookRouter = require("./importBook");

function route(app) {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/admin/v1/auth", adminAuthRouter);
  app.use("/api/v1/author", authorRouter);
  app.use("/api/v1/book", bookRouter);
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/member", memberRouter);
  app.use("/api/v1/profile", profileRouter);
  app.use("/api/v1/category", categoryRouter);
  app.use("/api/v1/discount", discountRouter);
  app.use("/api/v1/order", orderRouter);
  app.use("/api/v1/customerOrder", customerOrderRouter);
  app.use("/api/v1/profit", profitRouter);
  app.use("/api/v1/importBook", importBookRouter);
}

module.exports = route;
