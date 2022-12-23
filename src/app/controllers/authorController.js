const Author = require("../models/author");
const Book = require("../models/book");
const { omitFieldsNotUsingInObject } = require("../../utils/arrayMethods");
const { errResponse } = require("../constants/responseMessage");
const { deleteImage } = require("../firebase/firebaseServices");

const authorController = {
  addAuthor: async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(404).json(errResponse.NAME_REQUIRED);
      }
      const newAuthor = new Author(req.body);
      const savedAuthor = await newAuthor.save();
      res.status(200).json(savedAuthor.id);
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  getDetailAuthor: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const author = await Author.findById(id).lean();
      const { __v, ...other } = author;
      res.status(200).json(other);
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  getAllAuthor: async (req, res) => {
    try {
      const { page, size, searchKey } = req.query;
      const pageParam = page ? parseInt(page) : 0;
      const sizeParam = size ? parseInt(size) : 10;
      const searchParam = searchKey ? searchKey : "";
      const authorCount = await Author.estimatedDocumentCount();
      const authors = await Author.find({
        name: { $regex: searchParam, $options: "i" },
      })
        .sort({ name: 1 })
        .skip(pageParam * sizeParam)
        .limit(sizeParam)
        .lean();
      const responsAuthors = omitFieldsNotUsingInObject(authors, ["__v"]);
      res.status(200).json({
        data: responsAuthors,
        total: authorCount,
        page: pageParam,
        size: sizeParam,
      });
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  updateAuthor: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const nameExist = await Author.findOne({
        name: req.body.name,
      });
      if (nameExist && nameExist.id !== id) {
        return res.status(404).json(errResponse.NAME_EXIST);
      }
      const author = await Author.findById(id);
      await author.updateOne({ $set: req.body });
      res.status(200).json(author.id);
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  deleteAuthor: async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const author = await Author.findById(req.params.id).lean();
      const imageUrl = author.imageUrl;
      if (imageUrl) {
        deleteImage(imageUrl);
      }
      // await Book.updateMany({ authorId: req.params.id }, { authorId: null });
      await Author.findByIdAndDelete(req.params.id);
      res.status(200).json("deleted");
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
};

module.exports = authorController;
