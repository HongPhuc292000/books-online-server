const moment = require("moment");
const { omit } = require("lodash");
const Order = require("../models/order");
const User = require("../models/user");
const Book = require("../models/book");
const Discount = require("../models/discount");
const orderStatuses = require("../constants/orderStatus");
const { omitFieldsNotUsingInObject } = require("../../utils/arrayMethods");
const { errResponse } = require("../constants/responseMessage");

const orderController = {
  addOrder: async (req, res) => {
    try {
      const {
        customerId,
        customerName,
        products,
        customerPhoneNumber,
        orderDiscountId,
      } = req.body;
      const date = new Date();
      const orderCode = moment(date).format("HHmmss");
      let orderData = { ...req.body, orderCode: orderCode };
      if ((!customerId && !customerName) || !products || !customerPhoneNumber) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }

      const phoneExist = await User.findOne({
        phoneNumber: customerPhoneNumber,
      });

      if (!phoneExist) {
        const newUser = new User({
          phoneNumber: customerPhoneNumber,
          fullname: customerName,
        });
        const savedUser = await newUser.save();
        orderData = { ...orderData, customerId: savedUser.id };
      } else {
        orderData = { ...orderData, customerId: phoneExist.id };
      }
      const newOrder = new Order(orderData);
      const savedOrder = await newOrder.save();
      if (savedOrder) {
        //remove product in storage
        const productBought = savedOrder.products;
        productBought.forEach(async (product) => {
          const productData = await Book.findById(product.productId);
          await productData.updateOne({
            $set: {
              amount: productData.amount - product.amount,
              saled: productData?.saled
                ? productData.saled + product.amount
                : product.amount,
            },
          });
        });

        //remove coupon in storage
        if (orderDiscountId) {
          const discount = await Discount.findById(orderDiscountId);
          if (discount) {
            await discount.updateOne({ $set: { used: discount.used + 1 } });
          }
        }
      }
      res.status(200).json(savedOrder.id);
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  editOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, paymentType, totalPrices, products } = req.body;
      if (!id || !status) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const order = await Order.findById(id);
      if (status === orderStatuses.ORDERED && (!paymentType || !totalPrices)) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      if (products && order.status !== status) {
        if (status === orderStatuses.DONE) {
          console.log(products);

          products.forEach(async (product) => {
            const productData = await Book.findById(product.productId);
            await productData.updateOne({
              $set: {
                amount: productData.amount - product.amount,
                saled: productData?.saled
                  ? productData.saled + product.amount
                  : product.amount,
              },
            });
          });
        }
        if (status === orderStatuses.REPAY) {
          products.forEach(async (product) => {
            const productData = await Book.findById(product.productId);
            await productData.updateOne({
              $set: {
                amount: productData.amount + product.amount,
                saled: productData?.saled
                  ? productData.saled - product.amount
                  : product.amount,
              },
            });
          });
        }
      }
      await order.updateOne({ $set: req.body });
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
      const ordersCount = await Order.find({
        customerName: { $regex: searchText, $options: "i" },
      }).count();
      const orders = await Order.find({
        customerName: { $regex: searchText, $options: "i" },
      })
        .sort({ createdAt: -1 })
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
