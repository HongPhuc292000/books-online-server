const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const RefreshToken = require("../models/refreshToken");
const userRole = require("../../utils/constants");

const authController = {
  register: async (req, res, next) => {
    const { username, password, fullname, phoneNumber } = req.body;
    if (!username || !password || !fullname || !phoneNumber) {
      res.status(404).json("bad_request");
    } else {
      try {
        const userNameExist = await User.findOne({ username });
        const phoneNumberExist = await User.findOne({ phoneNumber });
        if (!!userNameExist) {
          res.status(404).json("username_exist");
        } else if (!!phoneNumberExist) {
          res.status(404).json("email_exist");
        } else {
          const newUser = new User({
            username,
            password: password,
            fullname,
            phoneNumber,
          });
          const createdUser = await newUser.save();
          res.json({ username: createdUser.username, password: password });
        }
      } catch {
        res.status(500).json("server_error");
      }
    }
  },
  generateAccessToken: (user) => {
    return jwt.sign(
      { id: user.id, roles: user.roles },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "5d",
      }
    );
  },
  generateRefreshToken: (user) => {
    return jwt.sign(
      { id: user.id, roles: user.roles },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "365d",
      }
    );
  },
  login: async (req, res, next) => {
    const { username, password } = req.body;
    try {
      if (!username || !password) {
        res.status(404).json("bad_request");
      } else {
        const userExist = await User.findOne({ username });
        if (!userExist) {
          res.status(400).json("username_not_correct");
        } else {
          const validPassword = password === userExist.password;
          if (!validPassword) {
            res.status(400).json("password_not_correct");
          } else {
            const accessToken = authController.generateAccessToken(userExist);
            const refreshToken = authController.generateRefreshToken(userExist);
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
      res.status(500).json("server_error");
    }
  },
  logout: async (req, res) => {
    try {
      await RefreshToken.findOneAndDelete({ token: req.params.refreshToken });
      res.status(200).json("logged_out");
    } catch {
      res.status(500).json("server_error");
    }
  },
  refreshTokenRequest: async (req, res) => {
    const refreshToken = req.params.refreshToken;
    const currentRefreshToken = await RefreshToken.findOne({
      token: refreshToken,
    });
    if (!refreshToken) {
      res.status(401).json("not_authenticated");
    } else {
      if (!currentRefreshToken) {
        return res.status(403).json("refresh_token_not_valid");
      }
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, user) => {
          if (err) {
            res.status(403).json("refresh_token_not_valid");
          } else {
            await RefreshToken.findByIdAndDelete(currentRefreshToken.id);
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            const newrefreshToken = new RefreshToken({ token: refreshToken });
            await newrefreshToken.save();
            res.status(200).json({
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            });
          }
        }
      );
    }
  },
};

module.exports = authController;
