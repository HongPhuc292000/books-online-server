const jwt = require("jsonwebtoken");

const middlewareController = {
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          res.status(403).json("token_not_valid");
        } else {
          req.body = user;
          next();
        }
      });
    } else {
      res.status(401).json("not_signed");
    }
  },
  verifyRole: (req, res, next) => {
    const user = req.body;
    if (user.id === req.params.id || user.role === "admin") {
      next();
    } else {
      res.status(403).json("not_allowed");
    }
  },
};

module.exports = middlewareController;
