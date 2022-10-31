const authRouter = require("./auth");

function route(app) {
  app.use("/api/v1/auth", authRouter);
}

module.exports = route;
