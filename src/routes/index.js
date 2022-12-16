const authRouter = require("./auth");
const authorRouter = require("./author");
const bookRouter = require("./book");
const userRouter = require("./user");
const memberRouter = require("./member");
const profileRouter = require("./profile");
const categoryRouter = require("./category");
const imageRouter = require("./image");
const adminAuthRouter = require("./adminAuth");
const discountRouter = require("./discount");

function route(app) {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/admin/v1/auth", adminAuthRouter);
  app.use("/api/v1/author", authorRouter);
  app.use("/api/v1/book", bookRouter);
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/member", memberRouter);
  app.use("/api/v1/profile", profileRouter);
  app.use("/api/v1/category", categoryRouter);
  app.use("/api/v1/image", imageRouter);
  app.use("/api/v1/discount", discountRouter);
}

module.exports = route;
