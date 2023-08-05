const Author = require("../models/author");
const Book = require("../models/book");
const { errResponse } = require("../constants/responseMessage");
const { deleteImage } = require("../firebase/firebaseServices");
const { omitFieldsNotUsingInObject } = require("../../utils/arrayMethods");
const bookStatus = require("../constants/status");

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
        if (imageUrl) {
          deleteImage(imageUrl);
        }
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const nameExist = await Book.findOne({ name: name });
      if (nameExist && nameExist.id !== id) {
        if (imageUrl) {
          deleteImage(imageUrl);
        }
        return res.status(404).json(errResponse.NAME_EXIST);
      }
      const book = await Book.findById(id);
      if ((!imageUrl && book.imageUrl) || book.imageUrl !== imageUrl) {
        deleteImage(book.imageUrl);
      }
      await book.updateOne({ $set: req.body });
      res.status(200).json(book.id);
    } catch (error) {
      if (req.body.imageUrl) {
        deleteImage(req.body.imageUrl);
      }
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  getAllBooksForOrder: async (req, res) => {
    try {
      const books = await Book.find({
        status: bookStatus.ENABLE,
        amount: { $gt: 0 },
      })
        .sort({ name: 1 })
        .lean();

      const responseBooks = omitFieldsNotUsingInObject(books, [
        "imageUrl",
        "authorId",
        "view",
        "categoryIds",
        "content",
        "isFull",
        "createdAt",
        "status",
        "weight",
        "__v",
      ]);
      res.status(200).json(responseBooks);
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  getAllBooks: async (req, res) => {
    try {
      const {
        page,
        size,
        searchKey,
        statuses,
        categoryIds,
        isNew,
        bestSaled,
        inStock,
        sort,
        authorId,
        exceptId,
      } = req.query;
      const pageParam = page ? parseInt(page) : 0;
      const sizeParam = size ? parseInt(size) : 10;
      const searchParam = searchKey ? searchKey : "";

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
          {
            isDelete: 0,
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
      // if (isNew) {
      //   queries = {
      //     ...queries,
      //     $and: [...queries.$and, { yearPublish:  }],
      //   };
      // }
      if (bestSaled) {
        queries = {
          ...queries,
          $and: [...queries.$and, { saled: { $gte: 100 } }],
        };
      }
      if (inStock === "true") {
        queries = {
          ...queries,
          $and: [...queries.$and, { amount: { $gt: 0 } }],
        };
      }
      if (authorId) {
        queries = {
          ...queries,
          $and: [...queries.$and, { authorId: authorId }],
        };
      }

      if (exceptId) {
        queries = {
          ...queries,
          $and: [...queries.$and, { _id: { $nin: [exceptId] } }],
        };
      }
      const booksCount = await Book.find(queries).count();
      const books = await Book.find(queries)
        // .sort({ reducedPrice: sort ? sort : 1 })
        .sort({ yearPublish: -1 })
        .skip(pageParam * sizeParam)
        .limit(sizeParam)
        .populate({ path: "authorId", select: "name" })
        .populate({ path: "categoryIds", select: "name" })
        .lean();

      const responseBooks = omitFieldsNotUsingInObject(books, [
        "content",
        "bookCode",
        "isFull",
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
      if (id.length === 12) {
        const book = await Book.findOne({ bookCode: id });
        const { _id, bookCode, imageUrl, name, defaultPrice, reducedPrice } =
          book;
        res.status(200).json({
          productId: _id,
          imageUrl,
          bookCode,
          name,
          amount: 1,
          defaultPrice,
          reducedPrice,
        });
      } else {
        const book = await Book.findById(id)
          .populate({ path: "authorId", select: "name" })
          .populate({ path: "categoryIds", select: "name" })
          .lean();
        const { __v, createdAt, ...others } = book;
        res.status(200).json(others);
      }
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
      // await Author.updateMany({ bookIds: id }, { $pull: { bookIds: id } });
      // const book = await Book.findById(id).lean();
      // const imageUrl = book.imageUrl;
      // if (imageUrl) {
      //   deleteImage(imageUrl);
      // }
      // await Book.findByIdAndDelete(id);
      const book = await Book.findById(id);
      await book.updateOne({ $set: { isDelete: 1 } });
      res.status(200).json("deleted");
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
};

module.exports = bookController;
