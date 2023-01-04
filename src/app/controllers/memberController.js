const Member = require("../models/member");
const { errResponse } = require("../constants/responseMessage");
const { omitFieldsNotUsingInObject } = require("../../utils/arrayMethods");
const { deleteImage } = require("../firebase/firebaseServices");

const memberController = {
  addMember: async (req, res) => {
    try {
      const { username, password, fullname, phoneNumber, birthday, email } =
        req.body;
      if (!username || !password || !fullname || !phoneNumber || !birthday) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const usernameExist = await Member.findOne({ username: username });
      const phoneExist = await Member.findOne({ phoneNumber: phoneNumber });
      const emailExist = await Member.findOne({ email: email });
      if (usernameExist) {
        return res.status(404).json(errResponse.USERNAME_EXIST);
      }
      if (phoneExist) {
        return res.status(404).json(errResponse.PHONE_EXIST);
      }
      if (emailExist) {
        return res.status(404).json(errResponse.EMAIL_EXIST);
      }
      const newMember = new Member(req.body);
      const savedMember = await newMember.save();
      res.status(200).json(savedMember.id);
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  editMember: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const { username, phoneNumber } = req.body;
      const usernameExist = await Member.findOne({ username: username });
      const phoneExist = await Member.findOne({
        phoneNumber: phoneNumber,
      });

      if (usernameExist && usernameExist.id !== id) {
        return res.status(404).json(errResponse.USERNAME_EXIST);
      }
      if (phoneExist && phoneExist.id !== id) {
        return res.status(404).json(errResponse.PHONE_EXIST);
      }
      const member = await Member.findById(id);
      await member.updateOne({ $set: req.body });
      res.status(200).json(member.id);
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  getAllMember: async (req, res) => {
    try {
      const { page, size, searchKey, roles } = req.query;
      const pageParam = page ? parseInt(page) : 0;
      const sizeParam = size ? parseInt(size) : 10;
      const searchParam = searchKey ? searchKey : "";
      const rolesParam = roles;
      const memberCount = await Member.estimatedDocumentCount();
      let members;
      if (!roles) {
        members = await Member.find({
          $or: [
            {
              fullname: { $regex: searchParam, $options: "i" },
            },
            {
              phoneNumber: { $regex: searchParam, $options: "i" },
            },
          ],
        })
          .sort({ fullname: 1 })
          .skip(pageParam * sizeParam)
          .limit(sizeParam)
          .lean();
      } else {
        members = await Member.find({
          $or: [
            {
              fullname: { $regex: searchKey, $options: "i" },
              roles: { $in: rolesParam },
            },
            {
              phoneNumber: { $regex: searchKey, $options: "i" },
              roles: { $in: rolesParam },
            },
          ],
        })
          .sort({ fullname: 1 })
          .skip(pageParam * sizeParam)
          .limit(sizeParam)
          .lean();
      }
      const responsMembers = omitFieldsNotUsingInObject(members, [
        "password",
        "roles",
        "gender",
        "birthday",
        "createdAt",
        "updatedAt",
        "__v",
      ]);
      res.status(200).json({
        data: responsMembers,
        total: memberCount,
        page: pageParam,
        size: sizeParam,
      });
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
      const { id } = req.params;
      if (!id) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const member = await Member.findById(id).lean();
      const imageUrl = member.imageUrl;
      if (imageUrl) {
        deleteImage(imageUrl);
      }
      await Member.findOneAndDelete(id);
      res.status(200).json("deleted");
    } catch {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
};

module.exports = memberController;
