const Author = require("../models/author");
const Book = require("../models/book");
const { omitFieldsNotUsingInObject } = require("../../utils/arrayMethods");
const { errResponse } = require("../constants/responseMessage");

const authorController = {
  addAuthor: async (req, res) => {
    try {
      if (!req.body.name) {
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
      const author = await Author.findById(id);
      const { __v, ...other } = author._doc;
      res.status(200).json(other);
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  getAllAuthor: async (req, res) => {
    try {
      const page = req.query.page || 0;
      const size = req.query.size || 10;
      const searchKey = req.query.searchKey ? req.query.searchKey : "";
      const authorCount = await Author.estimatedDocumentCount();
      const authors = await Author.find({
        name: { $regex: searchKey, $options: "i" },
      })
        .sort({ name: 1 })
        .skip(page * size)
        .limit(size)
        .lean();
      const responsAuthors = omitFieldsNotUsingInObject(authors, ["__v"]);
      res.status(200).json({
        data: responsAuthors,
        total: authorCount,
        page,
        size,
      });
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  updateAuthor: async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      if (!req.body.name) {
        return res.status(404).json(errResponse.NAME_REQUIRED);
      }
      const author = await Author.findById(req.params.id);
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
      // await Book.updateMany({ authorId: req.params.id }, { authorId: null });
      await Author.findByIdAndDelete(req.params.id);
      res.status(200).json("deleted");
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
};

module.exports = authorController;
