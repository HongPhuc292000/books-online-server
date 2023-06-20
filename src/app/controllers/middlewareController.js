const jwt = require("jsonwebtoken");
const alreadyRoles = require("../constants/roles");
const { errResponse } = require("../constants/responseMessage");

const middlewareController = {
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          res.status(401).json(errResponse.TOKEN_NOT_VALID);
        } else {
          req.body = {
            data: req.body,
            user,
          };
          next();
        }
      });
    } else {
      res.status(401).json(errResponse.NOT_SIGN);
    }
  },
  verifyRoles: (...allowedRoles) => {
    return (req, res, next) => {
      const { data, user } = req.body;
      if (!user.roles) {
        return res.status(403).json(errResponse.NOT_ALLOWED);
      }
      req.body = data;
      if (user.roles.includes(alreadyRoles.SUPER_ADMIN)) {
        next();
      } else {
        const rolesArray = [...allowedRoles];
        const result = user.roles
          .map((role) => rolesArray.includes(role))
          .find((value) => value === true);
        if (!result) {
          return res.status(403).json(errResponse.NOT_ALLOWED);
        }
        req.body = data;
        next();
      }
    };
  },
  verifyProfile: (req, res, next) => {
    const { user, data } = req.body;
    if (req.params.id === user.id) {
      req.body = data;
      next();
    } else {
      return res.status(403).json(errResponse.NOT_ALLOWED);
    }
  },
};

module.exports = middlewareController;
