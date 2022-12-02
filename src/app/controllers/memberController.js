const Member = require("../models/member");

const memberController = {
  addMember: async (req, res) => {
    try {
      if (
        !req.username ||
        !req.password ||
        !req.fullname ||
        !req.phoneNumber ||
        !birthday
      ) {
        return res.status(404).json("bad_request");
      }
      const newMember = new Member(req.body);
      const savedMember = await newMember.save();
      res.status(200).json(savedMember);
    } catch (error) {
      res.status(500).json("server_error");
    }
  },
  getAllMember: async (req, res) => {
    try {
      const members = await Member.find();
      res.status(200).json(members);
    } catch {
      res.status(500).json("server_error");
    }
  },
  getDetailMember: async (req, res) => {
    try {
      const member = await Member.findById(req.params.id);
      const { password, __v, ...others } = member._doc;
      res.status(200).json(others);
    } catch {
      res.status(500).json("server_error");
    }
  },
  deleteMember: async (req, res) => {
    try {
      await Member.findById(req.params.id);
      res.status(200).json("deleted");
    } catch {
      res.status(500).json("server_error");
    }
  },
};

module.exports = memberController;
