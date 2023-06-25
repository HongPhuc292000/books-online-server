const Member = require("../models/member");
const { errResponse } = require("../constants/responseMessage");
const { omitFieldsNotUsingInObject } = require("../../utils/arrayMethods");
const { deleteImage } = require("../firebase/firebaseServices");

const memberController = {
  addMember: async (req, res) => {
    try {
      const {
        username,
        password,
        fullname,
        phoneNumber,
        birthday,
        email,
        imageUrl,
      } = req.body;
      if (!username || !password || !fullname || !phoneNumber || !birthday) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const usernameExist = await Member.findOne({ username: username });
      const phoneExist = await Member.findOne({ phoneNumber: phoneNumber });
      const emailExist = await Member.findOne({ email: email });
      if (usernameExist) {
        if (imageUrl) {
          deleteImage(imageUrl);
        }
        return res.status(404).json(errResponse.USERNAME_EXIST);
      }
      if (phoneExist) {
        if (imageUrl) {
          deleteImage(imageUrl);
        }
        return res.status(404).json(errResponse.PHONE_EXIST);
      }
      if (emailExist) {
        if (imageUrl) {
          deleteImage(imageUrl);
        }
        return res.status(404).json(errResponse.EMAIL_EXIST);
      }
      const newMember = new Member(req.body);
      const savedMember = await newMember.save();
      res.status(200).json(savedMember.id);
    } catch (error) {
      if (req.body.imageUrl) {
        deleteImage(req.body.imageUrl);
      }
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  editMember: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const { username, phoneNumber, email, imageUrl } = req.body;
      const usernameExist = await Member.findOne({ username: username });
      const phoneExist = await Member.findOne({
        phoneNumber: phoneNumber,
      });
      const emailExist = await Member.findOne({ email: email });

      if (usernameExist && usernameExist.id !== id) {
        if (imageUrl) {
          deleteImage(imageUrl);
        }
        return res.status(404).json(errResponse.USERNAME_EXIST);
      }
      if (phoneExist && phoneExist.id !== id) {
        if (imageUrl) {
          deleteImage(imageUrl);
        }
        return res.status(404).json(errResponse.PHONE_EXIST);
      }
      if (emailExist && emailExist.id !== id) {
        if (imageUrl) {
          deleteImage(imageUrl);
        }
        return res.status(404).json(errResponse.EMAIL_EXIST);
      }
      const member = await Member.findById(id);
      if ((!imageUrl && member.imageUrl) || member.imageUrl !== imageUrl) {
        deleteImage(member.imageUrl);
      }
      await member.updateOne({ $set: req.body });
      res.status(200).json(member.id);
    } catch (error) {
      if (req.body.imageUrl) {
        deleteImage(req.body.imageUrl);
      }
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
      let queries = {
        $and: [
          {
            $or: [
              {
                fullname: { $regex: searchParam, $options: "i" },
              },
              {
                phoneNumber: { $regex: searchParam, $options: "i" },
              },
            ],
          },
          { isDelete: 0 },
        ],
      };
      if (roles) {
        queries = {
          ...queries,
          $and: [
            ...queries.$and,
            {
              roles: { $in: rolesParam },
            },
          ],
        };
      }
      const memberCount = await Member.find(queries).count();
      const members = await Member.find(queries)
        .sort({ fullname: 1 })
        .skip(pageParam * sizeParam)
        .limit(sizeParam)
        .lean();
      const responseMembers = omitFieldsNotUsingInObject(members, [
        "password",
        "roles",
        "gender",
        "birthday",
        "createdAt",
        "updatedAt",
        "__v",
      ]);
      res.status(200).json({
        data: responseMembers,
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
      const { __v, createdAt, updatedAt, ...others } = member._doc;
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
      const member = await Member.findById(id);
      await member.updateOne({ $set: { isDelete: 1 } });
      res.status(200).json("deleted");
    } catch {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
};

module.exports = memberController;
