const Account = require("../../models/User");
const _ = require("lodash");
const { mongooseToObject } = require("../../../utils/mongoose");

const PAGE_SIZE = 10;

class AuthController {
  register(req, res, next) {
    const { username, password, role, fullname } = req.body;
    Account.findOne({
      username,
    })
      .then((account) => {
        if (!!account) {
          res.status(500).json("User Exist Error!");
        } else {
          return Account.create({
            username,
            password,
            role,
            fullname,
          });
        }
      })
      .then((account) => {
        const accountRes = _.omit(mongooseToObject(account), "__v");
        console.log(accountRes);
        res.json(accountRes);
      })
      .catch((error) => res.status(500).json("Create Failure!"));
  }
  login(req, res, next) {
    const { username, password } = req.body;
    Account.findOne({
      username,
      password,
    })
      .then((account) => {
        if (!!account) {
          res.json("Login Success");
        } else {
          res.status(400).json("User name or password is not correct!");
        }
      })
      .catch((error) => res.status(500).json("Server error!"));
  }
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
}

module.exports = new AuthController();
