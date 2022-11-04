const Book = require("../models/book");
const Category = require("../models/category");

const categoryController = {
  addCategory: async (req, res) => {
    try {
      const newCategory = new Category(req.body);
      const savedCategory = await newCategory.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      res.status(500).json("server_error");
    }
  },
  //   getAllBooks: async (req, res) => {
  //     try {
  //       const books = await Book.find({});
  //       res.status(200).json(books);
  //     } catch (error) {
  //       res.status(500).json("server_error");
  //     }
  //   },
  //   getDetailBook: async (req, res) => {
  //     try {
  //       const book = await Book.findById(req.params.id).populate("author");
  //       res.status(200).json(book);
  //     } catch (error) {
  //       res.status(500).json("server_error");
  //     }
  //   },
  //   updateBook: async (req, res) => {
  //     try {
  //       const book = await Book.findById(req.params.id);
  //       await book.updateOne({ $set: req.body });
  //       res.status(200).json(book._id);
  //     } catch (error) {
  //       res.status(500).json("server_error");
  //     }
  //   },
  //   deleteBook: async (req, res) => {
  //     try {
  //       await Author.updateMany(
  //         { books: req.params.id },
  //         { $pull: { books: req.params.id } }
  //       );
  //       await Book.findByIdAndDelete(req.params.id);
  //       res.status(200).json("deleted");
  //     } catch (error) {
  //       res.status(500).json("server_error");
  //     }
  //   },
};

module.exports = categoryController;
