const Author = require("../models/author");
const Book = require("../models/book");

const authorController = {
  addAuthor: async (req, res) => {
    try {
      const newAuthor = new Author(req.body);
      const savedAuthor = await newAuthor.save();
      res.status(200).json(savedAuthor);
    } catch (error) {
      res.status(500).json("server_error");
    }
  },
  getDetailAuthor: async (req, res) => {
    try {
      const author = await Author.findById(req.params.id).populate("books");
      res.status(200).json(author);
    } catch (error) {
      res.status(500).json("server_error");
    }
  },
  getAllAuthor: async (req, res) => {
    try {
      const authors = await Author.find({});
      res.status(200).json(authors);
    } catch (error) {
      res.status(500).json("server_error");
    }
  },
  updateAuthor: async (req, res) => {
    try {
      const author = await Author.findById(req.params.id);
      await author.updateOne({ $set: req.body });
      res.status(200).json(author._id);
    } catch (error) {
      res.status(500).json("server_error");
    }
  },
  deleteAuthor: async (req, res) => {
    try {
      await Book.updateMany({ author: req.params.id }, { author: null });
      await Author.findByIdAndDelete(req.params.id);
      res.status(200).json("deleted");
    } catch (error) {
      res.status(500).json("server_error");
    }
  },
};

module.exports = authorController;
