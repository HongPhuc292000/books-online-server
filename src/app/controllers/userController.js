const User = require("../models/user");

const userController = {
  getAllUser: async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch {
      res.status(500).json("server_error");
    }
  },
  getDetailUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const { password, __v, ...others } = user._doc;
      res.status(200).json(others);
    } catch {
      res.status(500).json("server_error");
    }
  },
  deleteUser: async (req, res) => {
    try {
      await User.findById(req.params.id);
      res.status(200).json("deleted");
    } catch {
      res.status(500).json("server_error");
    }
  },
};

module.exports = userController;
