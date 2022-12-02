const Author = require("../models/author");
const Book = require("../models/book");

const bookController = {
  addBook: async (req, res) => {
    try {
      if (!req.body.name) {
        return res.status(404).json("name_required");
      }
      const newBook = new Book(req.body);
      const savedBook = await newBook.save();
      if (req.body.author) {
        const author = Author.findById(req.body.author);
        if (!!author) {
          await author.updateOne({ $push: { books: savedBook._id } });
        }
      }
      res.status(200).json(savedBook);
    } catch (error) {
      res.status(500).json("server_error");
    }
  },
  getAllBooks: async (req, res) => {
    try {
      const books = await Book.find({}).populate("authorId");
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json("server_error");
    }
  },
  getDetailBook: async (req, res) => {
    try {
      const book = await Book.findById(req.params.id)
        .populate("author")
        .populate("bookImg");
      res.status(200).json(book);
    } catch (error) {
      res.status(500).json("server_error");
    }
  },
  updateBook: async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      await book.updateOne({ $set: req.body });
      res.status(200).json(book._id);
    } catch (error) {
      res.status(500).json("server_error");
    }
  },
  deleteBook: async (req, res) => {
    try {
      await Author.updateMany(
        { books: req.params.id },
        { $pull: { books: req.params.id } }
      );
      await Book.findByIdAndDelete(req.params.id);
      res.status(200).json("deleted");
    } catch (error) {
      res.status(500).json("server_error");
    }
  },
};

module.exports = bookController;
