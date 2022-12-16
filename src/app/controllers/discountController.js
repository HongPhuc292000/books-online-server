const Discount = require("../models/discount");
const { omitFieldsNotUsingInObject } = require("../../utils/arrayMethods");
const { errResponse } = require("../constants/responseMessage");

const discountController = {
  addDiscount: async (req, res) => {
    try {
      const { type, code, value } = req.body;
      const discountCodeExist = await Discount.findOne({ code: code });
      if (!type || !code || !value) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      if (discountCodeExist.length > 0) {
        res.status(404).json(errResponse.CODE_EXIST);
      } else {
        const newDiscount = new Discount(req.body);
        const savedDiscount = await newDiscount.save();
        res.status(200).json(savedDiscount.id);
      }
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  editDiscount: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const discount = await Discount.findById(req.params.id);
      await discount.updateOne({ $set: req.body });
      res.status(200).json(discount.id);
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  getDetailDiscount: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const discount = await Discount.findById(req.params.id).lean();
      const { __v, ...other } = discount;
      res.status(200).json(other);
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  getAllDiscounts: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const size = parseInt(req.query.size) || 10;
      const searchKey = req.query.searchKey ? req.query.searchKey : "";
      const discountsCount = await Discount.estimatedDocumentCount();
      const discounts = await Discount.find({
        $or: [
          { code: { $regex: searchKey, $options: "i" } },
          { type: { $regex: searchKey, $options: "i" } },
        ],
      })
        .sort({ code: 1 })
        .skip(page * size)
        .limit(size)
        .lean();
      const responseDiscount = omitFieldsNotUsingInObject(discounts, ["__v"]);
      res
        .status(200)
        .json({ data: responseDiscount, total: discountsCount, page, size });
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  deleteDiscount: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const discount = await Discount.findById(req.params.id).lean();
      if (discount.used) {
        return res.status(404).json("used_code");
      }
      res.status(200).json("deleted");
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
};

module.exports = discountController;
