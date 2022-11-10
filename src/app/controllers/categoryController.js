const Book = require("../models/book");
const Category = require("../models/category");

const categoryController = {
  addCategory: async (req, res) => {
    const { type } = req.body;
    try {
      const categories = await Category.find({ type: type });
      if (!type) {
        return res.status(404).json("type_required");
      }
      if (categories.length > 0) {
        res.status(200).json("name_exist");
      } else {
        const newCategory = new Category({ type });
        const savedCategory = await newCategory.save();
        res.status(200).json(savedCategory);
      }
    } catch (error) {
      res.status(500).json("server_error");
    }
  },
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find({});
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json("server_error");
    }
  },
  deleteCategory: async (req, res) => {
    try {
      await Book.updateMany(
        { categories: req.params.id },
        { $pull: { categories: req.params.id } }
      );
      await Category.findByIdAndDelete(req.params.id);
      res.status(200).json("deleted");
    } catch (error) {
      res.status(500).json("server_error");
    }
  },
};

module.exports = categoryController;
