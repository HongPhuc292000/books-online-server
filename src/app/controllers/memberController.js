const Member = require("../models/member");
const { errResponse } = require("../constants/responseMessage");
const { omitFieldsNotUsingInObject } = require("../../utils/arrayMethods");

const memberController = {
  addMember: async (req, res) => {
    console.log(req.body);
    try {
      const { username, password, fullname, phoneNumber, birthday } = req.body;
      if (!username || !password || !fullname || !phoneNumber || !birthday) {
        return res.status(404).json("bad_request");
      }
      const newMember = new Member(req.body);
      const savedMember = await newMember.save();
      res.status(200).json(savedMember.id);
    } catch (error) {
      res.status(500).json("server_error");
    }
  },
  editMember: async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const member = await Member.findById(req.params.id);
      await member.updateOne({ $set: req.body });
      res.status(200).json(member.id);
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  getAllMember: async (req, res) => {
    try {
      const page = req.query.page || 0;
      const size = req.query.size || 10;
      const searchKey = req.query.searchKey ? req.query.searchKey : "";
      const memberCount = await Member.estimatedDocumentCount();

      const members = await Member.find({
        $or: [
          { fullname: { $regex: searchKey, $options: "i" } },
          { phoneNumber: { $regex: searchKey, $options: "i" } },
        ],
      })
        .sort({ fullname: 1 })
        .skip(page * size)
        .limit(size)
        .lean();
      const responsMembers = omitFieldsNotUsingInObject(members, [
        "password",
        "roles",
        "gender",
        "birthday",
        "createdAt",
        "updatedAt",
        "__v",
      ]);
      res
        .status(200)
        .json({ data: responsMembers, total: memberCount, page, size });
    } catch {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  getDetailMember: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const member = await Member.findById(id);
      const { __v, ...others } = member._doc;
      res.status(200).json(others);
    } catch {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  deleteMember: async (req, res) => {
    try {
      if (!id) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      await Member.findById(req.params.id);
      res.status(200).json("deleted");
    } catch {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
};

module.exports = memberController;
