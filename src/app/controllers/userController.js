const User = require("../models/user");
const { errResponse } = require("../constants/responseMessage");
const { omitFieldsNotUsingInObject } = require("../../utils/arrayMethods");
const { deleteImage } = require("../firebase/firebaseServices");

const userController = {
  addUser: async (req, res) => {
    try {
      const {
        username,
        password,
        fullname,
        phoneNumber,
        email,
        imageUrl,
        birthday,
      } = req.body;
      if (!username || !password || !phoneNumber || !birthday) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const usernameExist = await User.findOne({ username: username });
      const phoneExist = await User.findOne({ phoneNumber: phoneNumber });
      const emailExist = await User.findOne({ email: email });
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
      const newUser = new User({ ...req.body, fullname: fullname || username });
      const savedUser = await newUser.save();
      res.status(200).json(savedUser.id);
    } catch (error) {
      if (req.body.imageUrl) {
        deleteImage(req.body.imageUrl);
      }
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  editUser: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const { username, phoneNumber, email } = req.body;
      const usernameExist = await User.findOne({ username: username });
      const phoneExist = await User.findOne({
        phoneNumber: phoneNumber,
      });
      const emailExist = await User.findOne({ email: email });

      if (usernameExist && usernameExist.id !== id) {
        return res.status(404).json(errResponse.USERNAME_EXIST);
      }
      if (phoneExist && phoneExist.id !== id) {
        return res.status(404).json(errResponse.PHONE_EXIST);
      }
      if (emailExist && emailExist.id !== id) {
        return res.status(404).json(errResponse.EMAIL_EXIST);
      }
      const user = await User.findById(id);
      await user.updateOne({ $set: req.body });
      res.status(200).json(user.id);
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const { page, size, searchKey } = req.query;
      const pageParam = page ? parseInt(page) : 0;
      const sizeParam = size ? parseInt(size) : 10;
      const searchParam = searchKey ? searchKey : "";
      const userCount = await User.estimatedDocumentCount();
      let members;
      members = await User.find({
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
      const responsUsers = omitFieldsNotUsingInObject(members, [
        "password",
        "gender",
        "birthday",
        "createdAt",
        "updatedAt",
        "__v",
      ]);
      res.status(200).json({
        data: responsUsers,
        total: userCount,
        page: pageParam,
        size: sizeParam,
      });
    } catch {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  getDetailUser: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const user = await User.findById(id);
      const { __v, createdAt, updatedAt, ...others } = user._doc;
      res.status(200).json(others);
    } catch {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const user = await User.findById(id).lean();
      const imageUrl = user.imageUrl;
      if (imageUrl) {
        deleteImage(imageUrl);
      }
      await User.findOneAndDelete(id);
      res.status(200).json("deleted");
    } catch {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
};

module.exports = userController;
