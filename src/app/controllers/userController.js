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
  deleteUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json("Deleted!");
    } catch {
      res.status(500).json("server_error");
    }
  },
};

module.exports = userController;
