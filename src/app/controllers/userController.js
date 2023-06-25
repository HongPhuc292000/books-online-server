const User = require("../models/user");
const { errResponse } = require("../constants/responseMessage");
const { omitFieldsNotUsingInObject } = require("../../utils/arrayMethods");
const { deleteImage } = require("../firebase/firebaseServices");

const userController = {
  addUser: async (req, res) => {
    try {
      const { username, fullname, phoneNumber, email, imageUrl } = req.body;
      if (!phoneNumber || !fullname) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const usernameExist = await User.findOne({ username: username });
      const phoneExist = await User.findOne({ phoneNumber: phoneNumber });
      const emailExist = await User.findOne({ email: email });
      if (username && usernameExist) {
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
      if (email && emailExist) {
        if (imageUrl) {
          deleteImage(imageUrl);
        }
        return res.status(404).json(errResponse.EMAIL_EXIST);
      }
      const newUser = new User(req.body);
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
      const { username, phoneNumber, email, imageUrl } = req.body;
      const usernameExist = await User.findOne({ username: username });
      const phoneExist = await User.findOne({
        phoneNumber: phoneNumber,
      });
      const emailExist = await User.findOne({ email: email });
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
      if (email && emailExist && emailExist.id !== id) {
        if (imageUrl) {
          deleteImage(imageUrl);
        }
        return res.status(404).json(errResponse.EMAIL_EXIST);
      }
      const user = await User.findById(id);
      if ((!imageUrl && user.imageUrl) || user.imageUrl !== imageUrl) {
        deleteImage(user.imageUrl);
      }
      await user.updateOne({ $set: req.body });
      res.status(200).json(user.id);
    } catch (error) {
      const { imageUrl } = req.body;
      if (imageUrl) {
        deleteImage(imageUrl);
      }
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const { page, size, searchKey } = req.query;
      const pageParam = page ? parseInt(page) : 0;
      const sizeParam = size ? parseInt(size) : 10;
      const searchParam = searchKey ? searchKey : "";
      const userCount = await User.find({
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
      }).count();
      let members;
      members = await User.find({
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
      if (id.length === 10) {
        const user = await User.findOne({ phoneNumber: id });
        const { _id, fullname } = user._doc;
        res.status(200).json({ _id, fullname });
      } else {
        const user = await User.findById(id);
        const { __v, createdAt, updatedAt, ...others } = user._doc;
        res.status(200).json(others);
      }
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
      const user = await User.findById(id);
      await user.updateOne({ $set: { isDelete: 1 } });
      res.status(200).json("deleted");
    } catch {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
};

module.exports = userController;
