const moment = require("moment");
const { omit } = require("lodash");
const Order = require("../models/order");
const { omitFieldsNotUsingInObject } = require("../../utils/arrayMethods");
const { errResponse } = require("../constants/responseMessage");

const orderController = {
  addOrder: async (req, res) => {
    try {
      const {
        customerId,
        customerName,
        products,
        phoneNumber,
        orderPrices,
        shipPrices,
        totalPrices,
      } = req.body;
      if ((!customerId && !customerName) || !products || !phoneNumber) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const newOrder = new Order(req.body);
      const savedOrder = await newOrder.save();
      res.status(200).json(savedOrder.id);
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  editOrder: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const order = await Order.findById(id);
      await order.updateOne({ $set: req.body });
      // const discountCodeExist = await Discount.findOne({ code: req.body.code });
      // if (discountCodeExist && discountCodeExist.id !== id) {
      //   return res.status(404).json(errResponse.CODE_EXIST);
      // }
      // if (req.body.exp) {
      //   const formDataNoExp = omit(req.body, ["exp"]);
      //   const expTimeStamp = moment(req.body.exp).valueOf();
      //   const discount = await Discount.findById(req.params.id);
      //   await discount.updateOne({
      //     $set: { ...formDataNoExp, exp: expTimeStamp },
      //   });
      //   res.status(200).json(discount.id);
      // } else {
      //   const discount = await Discount.findById(req.params.id);
      //   await discount.updateOne({ $set: req.body });
      //   res.status(200).json(discount.id);
      // }
      res.status(200).json(order.id);
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  getDetailOrder: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const order = await Order.findById(id).lean();
      const { __v, ...other } = order;
      res.status(200).json(other);
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  getAllOrders: async (req, res) => {
    try {
      const { searchKey, page, size } = req.query;
      const pageParam = page ? parseInt(page) : 0;
      const sizeParam = size ? parseInt(size) : 10;
      const searchText = searchKey ? searchKey : "";
      // const fiveYearsAgo = moment().get("y") + 5;
      // const minDateParam = minDate
      //   ? minDate
      //   : moment("1970-01-01T00:00:00+07:00").valueOf();
      // const maxDateParam = maxDate
      //   ? maxDate
      //   : moment(`${fiveYearsAgo}-01-01T00:00:00+07:00`).valueOf();
      const ordersCount = await Order.estimatedDocumentCount();
      const orders = await Order.find({
        // $or: [
        //   {
        //     customerName: { $regex: searchText, $options: "i" },
        //     // exp: { $gte: minDateParam, $lte: maxDateParam },
        //   },
        //   // {
        //   //   type: { $regex: searchText, $options: "i" },
        //   //   // exp: { $gte: minDateParam, $lte: maxDateParam },
        //   // },
        // ],
      })
        // .sort()
        .skip(pageParam * sizeParam)
        .limit(sizeParam)
        .lean();
      const responseOrder = omitFieldsNotUsingInObject(orders, ["__v"]);
      res.status(200).json({
        data: responseOrder,
        total: ordersCount,
        page: pageParam,
        size: sizeParam,
      });
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  deleteOrder: async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      await Order.findByIdAndDelete(req.params.id);
      res.status(200).json("deleted");
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
};

module.exports = orderController;
