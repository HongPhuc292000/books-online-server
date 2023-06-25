const Book = require("../models/book");
const ImportBook = require("../models/importBook");
const { omitFieldsNotUsingInObject } = require("../../utils/arrayMethods");
const { errResponse } = require("../constants/responseMessage");

const importBookController = {
  addImportBook: async (req, res) => {
    try {
      const { orderCode, createdBy, products } = req.body;
      if (!orderCode || !createdBy || !products) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const newImportBook = new ImportBook(req.body);
      const savedImportBook = await newImportBook.save();
      products.forEach(async (product) => {
        const productData = await Book.findById(product.productId);
        await productData.updateOne({
          $set: {
            amount: productData.amount + product.amount,
          },
        });
      });
      res.status(200).json(savedImportBook.id);
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  getDetailImportBook: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const importBook = await ImportBook.findById(id)
        .populate({ path: "createdBy", select: "fullname" })
        .lean();
      const { __v, ...other } = importBook;
      res.status(200).json(other);
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  getAllImportBooks: async (req, res) => {
    try {
      const { page, size, searchKey } = req.query;
      const pageParam = page ? parseInt(page) : 0;
      const sizeParam = size ? parseInt(size) : 10;
      const searchParam = searchKey ? searchKey : "";
      const importBookCount = await ImportBook.find({
        orderCode: { $regex: searchParam, $options: "i" },
      }).count();
      const importBooks = await ImportBook.find({
        orderCode: { $regex: searchParam, $options: "i" },
      })
        .sort({ createdAt: -1 })
        .skip(pageParam * sizeParam)
        .limit(sizeParam)
        .populate({ path: "createdBy", select: "fullname" })
        .lean();
      const responseImportBooks = omitFieldsNotUsingInObject(importBooks, [
        "products",
        "__v",
      ]);
      res.status(200).json({
        data: responseImportBooks,
        total: importBookCount,
        page: pageParam,
        size: sizeParam,
      });
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  updateStatusImportBook: async (req, res) => {
    try {
      const { id } = req.params;
      const { isCancel } = req.body;
      if (!id) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }

      const importBook = await ImportBook.findById(id);
      await importBook.updateOne({ $set: { isCancel: isCancel } });
      const products = importBook.products;
      if (isCancel) {
        products.forEach(async (product) => {
          const productData = await Book.findById(product.productId);
          await productData.updateOne({
            $set: {
              amount: productData.amount - product.amount,
            },
          });
        });
      } else {
        products.forEach(async (product) => {
          const productData = await Book.findById(product.productId);
          await productData.updateOne({
            $set: {
              amount: productData.amount + product.amount,
            },
          });
        });
      }
      res.status(200).json(importBook.id);
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  //   updateImportBook: async (req, res) => {
  //     try {
  //       const { id } = req.params;
  //       const { isCancel } = req.body;
  //       if (!id) {
  //         return res.status(404).json(errResponse.BAD_REQUEST);
  //       }
  //       const nameExist = await Author.findOne({
  //         name: name,
  //       });
  //       if (nameExist && nameExist.id !== id) {
  //         if (imageUrl) {
  //           deleteImage(imageUrl);
  //         }
  //         return res.status(404).json(errResponse.NAME_EXIST);
  //       }
  //       const author = await Author.findById(id);
  //       if ((!imageUrl && author.imageUrl) || author.imageUrl !== imageUrl) {
  //         deleteImage(author.imageUrl);
  //       }
  //       await author.updateOne({ $set: req.body });
  //       res.status(200).json(author.id);
  //     } catch (error) {
  //       if (req.body.imageUrl) {
  //         deleteImage(req.body.imageUrl);
  //       }
  //       res.status(500).json(errResponse.SERVER_ERROR);
  //     }
  //   },
};

module.exports = importBookController;
