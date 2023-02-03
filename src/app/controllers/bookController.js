const Author = require("../models/author");
const Book = require("../models/book");
const { errResponse } = require("../constants/responseMessage");
const { deleteImage } = require("../firebase/firebaseServices");
const { omitFieldsNotUsingInObject } = require("../../utils/arrayMethods");

const bookController = {
  addBook: async (req, res) => {
    try {
      const { imageUrl, name, defaultPrice, bookCode, authorId } = req.body;
      if (!imageUrl || !name || !defaultPrice || !bookCode) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const nameExist = await Book.findOne({ name: name });
      const codeExist = await Book.findOne({ bookCode: bookCode });

      if (nameExist) {
        if (imageUrl) {
          deleteImage(imageUrl);
        }
        return res.status(404).json(errResponse.NAME_EXIST);
      }
      if (codeExist) {
        if (imageUrl) {
          deleteImage(imageUrl);
        }
        return res.status(404).json(errResponse.CODE_EXIST);
      }
      const newBook = new Book(req.body);
      const savedBook = await newBook.save();
      if (authorId) {
        const author = Author.findById(authorId);
        if (!!author) {
          await author.updateOne({ $push: { bookIds: savedBook._id } });
        }
      }
      res.status(200).json(savedBook.id);
    } catch (error) {
      if (req.body.imageUrl) {
        deleteImage(req.body.imageUrl);
      }
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  editBook: async (req, res) => {
    try {
      const { id } = req.params;
      const { imageUrl, name } = req.body;
      if (!id) {
        //   if (imageUrl) {
        //     deleteImage(imageUrl);
        //   }
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const nameExist = await Book.findOne({ name: name });
      if (nameExist && nameExist.id !== id) {
        //   if (imageUrl) {
        //     deleteImage(imageUrl);
        //   }
        return res.status(404).json(errResponse.NAME_EXIST);
      }
      const book = await Book.findById(id);
      await book.updateOne({ $set: req.body });
      res.status(200).json(book.id);
    } catch (error) {
      // if (req.body.imageUrl) {
      //   deleteImage(req.body.imageUrl);
      // }
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  getAllBooks: async (req, res) => {
    try {
      const { page, size, searchKey, statuses, categoryIds } = req.query;
      const pageParam = page ? parseInt(page) : 0;
      const sizeParam = size ? parseInt(size) : 10;
      const searchParam = searchKey ? searchKey : "";
      const booksCount = await Book.estimatedDocumentCount();
      let queries = {
        $and: [
          {
            $or: [
              {
                name: { $regex: searchParam, $options: "i" },
              },
              {
                bookCode: { $regex: searchParam, $options: "i" },
              },
            ],
          },
        ],
      };
      if (statuses) {
        queries = {
          ...queries,
          $and: [...queries.$and, { status: { $in: statuses } }],
        };
      }
      if (categoryIds) {
        queries = {
          ...queries,
          $and: [...queries.$and, { categoryIds: { $in: categoryIds } }],
        };
      }
      const books = await Book.find(queries)
        .sort({ name: 1 })
        .skip(pageParam * sizeParam)
        .limit(sizeParam)
        .populate({ path: "authorId", select: "name" })
        .populate({ path: "categoryIds", select: "name" })
        .lean();

      const responseBooks = omitFieldsNotUsingInObject(books, [
        "imageUrl",
        "publisherId",
        "content",
        "bookCode",
        "isFull",
        "createdAt",
        "__v",
      ]);
      res.status(200).json({
        data: responseBooks,
        total: booksCount,
        page: pageParam,
        size: sizeParam,
      });
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  getDetailBook: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const book = await Book.findById(id);
      const { __v, createdAt, ...others } = book._doc;
      res.status(200).json(others);
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  deleteBook: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      await Author.updateMany({ bookIds: id }, { $pull: { bookIds: id } });
      const book = await Book.findById(id).lean();
      const imageUrl = book.imageUrl;
      if (imageUrl) {
        deleteImage(imageUrl);
      }
      await Book.findByIdAndDelete(id);
      res.status(200).json("deleted");
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
};

module.exports = bookController;
