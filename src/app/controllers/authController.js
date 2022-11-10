const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const RefreshToken = require("../models/refreshToken");
const { mongooseToObject } = require("../../utils/mongoose");

const PAGE_SIZE = 10;

const authController = {
  register: async (req, res, next) => {
    const { username, password, role, fullname, email } = req.body;
    if (!username || !password || !role || !fullname || !email) {
      res.status(404).json("bad_request");
    } else {
      try {
        const userNameExist = await User.findOne({ username });
        const emailExist = await User.findOne({ email });
        if (!!userNameExist) {
          res.status(404).json("username_exist");
        } else if (!!emailExist) {
          res.status(404).json("email_exist");
        } else {
          const salt = await bcrypt.genSalt(10);
          const hashed = await bcrypt.hash(password, salt);
          const newUser = new User({
            username,
            password: hashed,
            role,
            fullname,
            email,
          });
          const createdUser = await newUser.save();
          const accountRes = _.omit(mongooseToObject(createdUser), "__v");
          res.json(accountRes);
        }
      } catch {
        res.status(500).json("server_error");
      }
    }
  },
  generateAccessToken: (user) => {
    return jwt.sign(
      { id: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );
  },
  generateRefreshToken: (user) => {
    return jwt.sign(
      { id: user.id, role: user.role },
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
          const validPassword = await bcrypt.compare(
            password,
            userExist.password
          );
          if (!validPassword) {
            res.status(400).json("password_not_correct");
          } else {
            const accessToken = authController.generateAccessToken(userExist);
            const refreshToken = authController.generateRefreshToken(userExist);
            refreshTokens.push(refreshToken);
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
      res.clearCookie("refreshToken");
      await RefreshToken.findOneAndDelete({ token: req.cookies.refreshToken });
      res.status(200).json("logged_out");
    } catch {
      res.status(500).json("server_error");
    }
  },
  refreshTokenRequest: async (req, res) => {
    const newRefreshToken = req.cookies.refreshToken;
    const currentRefreshToken = await RefreshToken.findOne({
      token: newRefreshToken,
    });
    if (!newRefreshToken) {
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
            console.log(err);
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
