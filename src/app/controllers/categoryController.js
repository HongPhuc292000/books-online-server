const Book = require("../models/book");
const Category = require("../models/category");
const { omitFieldsNotUsingInObject } = require("../../utils/arrayMethods");
const { errResponse } = require("../constants/responseMessage");

const categoryController = {
  addCategory: async (req, res) => {
    const { type, name } = req.body;
    try {
      const categoriesNameExist = await Category.findOne({ name: name });
      const categoriesTypeExist = await Category.findOne({ type: type });
      if (!type || !name) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      if (categoriesNameExist.length > 0) {
        res.status(404).json(errResponse.NAME_EXIST);
      } else if (categoriesTypeExist.length > 0) {
        res.status(404).json(errResponse.TYPE_EXIST);
      } else {
        const newCategory = new Category({ type, name });
        const savedCategory = await newCategory.save();
        res.status(200).json(savedCategory.id);
      }
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  getAllCategories: async (req, res) => {
    try {
      const { page, size } = req.query;
      const pageParam = page ? parseInt(page) : 0;
      const sizeParam = size ? parseInt(size) : 10;
      const searchKey = req.query.searchKey ? req.query.searchKey : "";
      const categoriesCount = await Category.estimatedDocumentCount();
      const categories = await Category.find({
        $or: [
          { name: { $regex: searchKey, $options: "i" } },
          { type: { $regex: searchKey, $options: "i" } },
        ],
      })
        .sort({ name: 1 })
        .skip(pageParam * sizeParam)
        .limit(sizeParam)
        .lean();
      const responsCategories = omitFieldsNotUsingInObject(categories, ["__v"]);
      res
        .status(200)
        .json({
          data: responsCategories,
          total: categoriesCount,
          page: pageParam,
          size: sizeParam,
        });
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  deleteCategory: async (req, res) => {
    try {
      // await Book.updateMany(
      //   { categories: req.params.id },
      //   { $pull: { categories: req.params.id } }
      // );
      const { id } = req.params;
      if (!id) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      await Category.findByIdAndDelete(req.params.id);
      res.status(200).json("deleted");
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
};

module.exports = categoryController;
