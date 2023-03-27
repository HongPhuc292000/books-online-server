const moment = require("moment");
const { omit } = require("lodash");
const Order = require("../models/order");
const { omitFieldsNotUsingInObject } = require("../../utils/arrayMethods");
const { errResponse } = require("../constants/responseMessage");

const orderController = {
  addOrder: async (req, res) => {
    try {
      const { customerId, products, orderPrices, shipPrices, totalPrices } =
        req.body;
      if (
        !customerId ||
        !products ||
        !orderPrices ||
        !shipPrices ||
        !totalPrices
      ) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const newOrder = new Order(req.body);
      const savedOrder = await newOrder.save();

      res.status(200).json(savedOrder.id);
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
      const discountCodeExist = await Discount.findOne({ code: req.body.code });
      if (discountCodeExist && discountCodeExist.id !== id) {
        return res.status(404).json(errResponse.CODE_EXIST);
      }
      if (req.body.exp) {
        const formDataNoExp = omit(req.body, ["exp"]);
        const expTimeStamp = moment(req.body.exp).valueOf();
        const discount = await Discount.findById(req.params.id);
        await discount.updateOne({
          $set: { ...formDataNoExp, exp: expTimeStamp },
        });
        res.status(200).json(discount.id);
      } else {
        const discount = await Discount.findById(req.params.id);
        await discount.updateOne({ $set: req.body });
        res.status(200).json(discount.id);
      }
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
      const { searchKey, minDate, maxDate, page, size } = req.query;
      const pageParam = page ? parseInt(page) : 0;
      const sizeParam = size ? parseInt(size) : 10;
      const searchText = searchKey ? searchKey : "";
      const fiveYearsAgo = moment().get("y") + 5;
      const minDateParam = minDate
        ? minDate
        : moment("1970-01-01T00:00:00+07:00").valueOf();
      const maxDateParam = maxDate
        ? maxDate
        : moment(`${fiveYearsAgo}-01-01T00:00:00+07:00`).valueOf();
      const discountsCount = await Discount.estimatedDocumentCount();
      const discounts = await Discount.find({
        $or: [
          {
            code: { $regex: searchText, $options: "i" },
            exp: { $gte: minDateParam, $lte: maxDateParam },
          },
          {
            type: { $regex: searchText, $options: "i" },
            exp: { $gte: minDateParam, $lte: maxDateParam },
          },
        ],
      })
        .sort({ code: 1 })
        .skip(pageParam * sizeParam)
        .limit(sizeParam)
        .lean();
      const responseDiscount = omitFieldsNotUsingInObject(discounts, ["__v"]);
      res.status(200).json({
        data: responseDiscount,
        total: discountsCount,
        page: pageParam,
        size: sizeParam,
      });
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
        return res.status(404).json(errResponse.USED_CODE);
      }
      res.status(200).json("deleted");
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
};

module.exports = orderController;
