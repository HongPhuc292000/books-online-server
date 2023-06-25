const Book = require("../models/book");
const Category = require("../models/category");
const {
  omitFieldsNotUsingInObject,
  pickFieldsUsingInObject,
} = require("../../utils/arrayMethods");
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
      if (categoriesNameExist) {
        return res.status(404).json(errResponse.NAME_EXIST);
      }
      if (categoriesTypeExist) {
        return res.status(404).json(errResponse.TYPE_EXIST);
      }
      const newCategory = new Category({ type, name });
      const savedCategory = await newCategory.save();
      res.status(200).json(savedCategory.id);
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
      const categoriesCount = await Category.find({
        $and: [
          {
            $or: [
              { name: { $regex: searchKey, $options: "i" } },
              { type: { $regex: searchKey, $options: "i" } },
            ],
          },
          { isDelete: 0 },
        ],
      }).count();
      const categories = await Category.find({
        $and: [
          {
            $or: [
              { name: { $regex: searchKey, $options: "i" } },
              { type: { $regex: searchKey, $options: "i" } },
            ],
          },
          { isDelete: 0 },
        ],
      })
        .sort({ name: 1 })
        .skip(pageParam * sizeParam)
        .limit(sizeParam)
        .lean();
      const responsCategories = omitFieldsNotUsingInObject(categories, ["__v"]);
      res.status(200).json({
        data: responsCategories,
        total: categoriesCount,
        page: pageParam,
        size: sizeParam,
      });
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  getCategoryToSelect: async (req, res) => {
    try {
      const authors = await Category.find({ isDelete: 0 })
        .sort({ name: 1 })
        .lean();
      const responseCategories = pickFieldsUsingInObject(authors, [
        "_id",
        "name",
      ]);
      res.status(200).json(responseCategories);
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      // await Book.updateMany(
      //   { categoryIds: req.params.id },
      //   { $pull: { categoryIds: req.params.id } }
      // );
      const category = await Category.findById(req.params.id);
      await category.updateOne({ $set: { isDelete: 1 } });
      res.status(200).json("deleted");
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
};

module.exports = categoryController;
