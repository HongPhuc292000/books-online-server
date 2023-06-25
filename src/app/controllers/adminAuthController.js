const jwt = require("jsonwebtoken");
const Member = require("../models/member");
const RefreshToken = require("../models/refreshToken");
const { errResponse } = require("../constants/responseMessage");
const roles = require("../constants/roles");

const adminAuthController = {
  generateAccessToken: (member) => {
    return jwt.sign(
      { id: member.id, roles: member.roles },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
  },
  generateRefreshToken: (member) => {
    return jwt.sign(
      { id: member.id, roles: member.roles },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "365d",
      }
    );
  },
  login: async (req, res) => {
    const { username, password } = req.body;
    try {
      if (!username || !password) {
        res.status(404).json(errResponse.BAD_REQUEST);
      } else {
        const userExist = await Member.findOne({ username });
        if (!userExist) {
          res.status(400).json("username_not_correct");
        } else {
          const validPassword = password === userExist.password;
          if (!validPassword) {
            res.status(400).json("password_not_correct");
          } else {
            const accessToken =
              adminAuthController.generateAccessToken(userExist);
            const refreshToken =
              adminAuthController.generateRefreshToken(userExist);
            const newrefreshToken = new RefreshToken({ token: refreshToken });
            await newrefreshToken.save();
            res.status(200).json({
              accessToken,
              refreshToken,
            });
          }
        }
      }
    } catch {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  logout: async (req, res) => {
    try {
      await RefreshToken.findOneAndDelete({ token: req.params.refreshToken });
      res.status(200).json("logged_out");
    } catch {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  refreshTokenRequest: async (req, res) => {
    const refreshToken = req.params.refreshToken;
    const currentRefreshToken = await RefreshToken.findOne({
      token: refreshToken,
    });
    if (!refreshToken) {
      return res.status(401).json(errResponse.NOT_AUTHORIZED);
    } else {
      if (!currentRefreshToken) {
        return res.status(403).json(errResponse.REFRESH_TOKEN_NOT_VALID);
      }
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, member) => {
          if (err) {
            return res.status(403).json(errResponse.REFRESH_TOKEN_NOT_VALID);
          } else {
            await RefreshToken.findByIdAndDelete(currentRefreshToken.id);
            const newAccessToken =
              adminAuthController.generateAccessToken(member);
            const newRefreshToken =
              adminAuthController.generateRefreshToken(member);
            const toSaveRfToken = new RefreshToken({
              token: newRefreshToken,
            });
            await toSaveRfToken.save();
            return res.status(200).json({
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            });
          }
        }
      );
    }
  },
  getAllRoles: async (req, res) => {
    try {
      const rolesArray = Object.keys(roles);
      const responseRoles = rolesArray.filter(
        (item) => item !== roles.SUPER_ADMIN
      );
      res.status(200).json(responseRoles);
    } catch {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
};

module.exports = adminAuthController;
