const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const { mongooseToObject } = require("../../../utils/mongoose");

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
            const accessToken = jwt.sign(
              { id: userExist.id, role: userExist.role },
              process.env.ACCESS_TOKEN_SECRET,
              {
                expiresIn: "1h",
              }
            );
            const { password, __v, ...other } = userExist._doc;
            res.status(200).json({
              other,
              accessToken,
            });
          }
        }
      }
    } catch {
      res.status(500).json("server_error");
    }
  },
  // getListAccount(req, res, next) {
  //   let { page, size } = req.query;
  //   if (page && !parseInt(page)) {
  //     page = 1;
  //   } else {
  //     page = parseInt(page);
  //   }

  //   const startItem = (page - 1) * size;

  //   Account.find({})
  //     .skip(startItem)
  //     .limit(size)
  //     .then((data) => {
  //       if (!!data) {
  //         res.json(data);
  //       } else {
  //         res.status(400).json("Unexpected Error!");
  //       }
  //     })
  //     .catch((error) => res.status(500).json("Server error!"));
  // }
};

module.exports = authController;
