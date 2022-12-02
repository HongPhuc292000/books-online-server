const Author = require("../models/author");
const Book = require("../models/book");
const { omitFieldsNotUsingInObject } = require("../../utils/arrayMethods");

const authorController = {
  addAuthor: async (req, res) => {
    try {
      if (!req.body.name) {
        return res.status(404).json("name_required");
      }
      const newAuthor = new Author(req.body);
      const savedAuthor = await newAuthor.save();
      res.status(200).json(savedAuthor);
    } catch (error) {
      res.status(500).json("server_error");
    }
  },
  getDetailAuthor: async (req, res) => {
    try {
      const author = await Author.findById(req.params.id);
      const { __v, ...other } = author._doc;
      res.status(200).json(other);
    } catch (error) {
      res.status(500).json("server_error");
    }
  },
  getAllAuthor: async (req, res) => {
    try {
      const authors = await Author.find({}).lean();
      const responsAuthors = omitFieldsNotUsingInObject(authors, ["__v"]);
      res.status(200).json(responsAuthors);
    } catch (error) {
      res.status(500).json("server_error");
    }
  },
  updateAuthor: async (req, res) => {
    try {
      if (!req.body.name) {
        return res.status(404).json("name_required");
      }
      const author = await Author.findById(req.params.id);
      await author.updateOne({ $set: req.body });
      res.status(200).json(author._id);
    } catch (error) {
      res.status(500).json("server_error");
    }
  },
  deleteAuthor: async (req, res) => {
    try {
      await Book.updateMany({ authorId: req.params.id }, { authorId: null });
      await Author.findByIdAndDelete(req.params.id);
      res.status(200).json("deleted");
    } catch (error) {
      res.status(500).json("server_error");
    }
  },
};

module.exports = authorController;
