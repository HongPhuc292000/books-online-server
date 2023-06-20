const moment = require("moment");
const { omit } = require("lodash");
const Order = require("../models/order");
const User = require("../models/user");
const Discount = require("../models/discount");
const Book = require("../models/book");
const orderStatuses = require("../constants/orderStatus");
const { omitFieldsNotUsingInObject } = require("../../utils/arrayMethods");
const { errResponse } = require("../constants/responseMessage");
const { removeVietnameseTones } = require("../../utils/stringMethod");

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

const customerOrderController = {
  addProductTocart: async (req, res) => {
    try {
      const { customerId, isInsertAmount, ...other } = req.body.data;
      if (!customerId) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      let productRequestData = other;
      const currentCart = await Order.findOne({
        customerId: customerId,
        status: orderStatuses.INCART,
      }).lean();
      console.log(currentCart);
      if (currentCart) {
        const existProducts = currentCart.products;
        let newProducts = [];
        const newProductExist = existProducts.find((product) => {
          return product.productId.toString() === productRequestData.productId;
        });
        if (newProductExist) {
          existProducts.forEach((product) => {
            if (product.productId.toString() === productRequestData.productId) {
              newProducts = [
                ...newProducts,
                {
                  ...product,
                  amount: !!isInsertAmount
                    ? productRequestData.amount
                    : product.amount + productRequestData.amount,
                },
              ];
            } else {
              newProducts = [...newProducts, product];
            }
          });
        } else {
          newProducts = [...existProducts, productRequestData];
        }

        const updatedCart = await Order.findOneAndUpdate(
          { customerId: customerId, status: orderStatuses.INCART },
          {
            $set: { products: newProducts },
          }
        );
        res.status(200).json(updatedCart.id);
      } else {
        const customer = await User.findById(customerId).lean();
        const newOrder = new Order({
          customerId: customer._id,
          customerName: customer.fullname,
          customerPhoneNumber: customer.phoneNumber,
          products: productRequestData,
        });
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder.id);
      }
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  getDetailInCartOrder: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const order = await Order.findOne({
        customerId: id,
        status: orderStatuses.INCART,
      }).lean();
      if (order) {
        const { __v, ...other } = order;
        res.status(200).json(other);
      } else {
        res.status(200).json("no_data");
      }
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  removeProductIncart: async (req, res) => {
    try {
      const { customerId, productId } = req.body.data;
      if (!customerId || !productId) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const order = await Order.findOne({
        customerId: customerId,
        status: orderStatuses.INCART,
      }).lean();
      console.log(order);
      const newProducts = order.products.filter(
        (product) => product.productId.toString() !== productId
      );

      const updatedCart = await Order.findOneAndUpdate(
        { customerId: customerId },
        {
          $set: { products: newProducts },
        }
      );
      res.status(200).json(updatedCart.id);
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  checkoutOffline: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        customerId,
        status,
        paymentType,
        products,
        customerAddress,
        orderDiscountId,
      } = req.body.data;
      if (
        !id ||
        !customerId ||
        !status ||
        !products ||
        !paymentType ||
        !paymentType ||
        !customerAddress
      ) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const date = new Date();
      const orderCode = moment(date).format("HHmmss");
      const order = await Order.findById(id);
      await order.updateOne({
        $set: { ...req.body.data, orderCode: orderCode },
      });
      if (orderDiscountId) {
        const discount = await Discount.findById(orderDiscountId);
        if (discount) {
          await discount.updateOne({ $set: { used: discount.used + 1 } });
        }
      }
      res.status(200).json(order.id);
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  checkoutOnline: async (req, res) => {
    try {
      const { id, formValue } = req.body.data;
      const {
        customerId,
        status,
        paymentType,
        products,
        customerAddress,
        customerName,
        totalPrices,
        orderDiscountId,
      } = formValue;
      if (
        !id ||
        !customerId ||
        !status ||
        !products ||
        !paymentType ||
        !paymentType ||
        !customerAddress ||
        !totalPrices
      ) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const date = new Date();
      const orderCode = moment(date).format("HHmmss");

      const order = await Order.findById(id);
      await order.updateOne({
        $set: { ...formValue, orderCode: orderCode },
      });
      if (orderDiscountId) {
        const discount = await Discount.findById(orderDiscountId);
        if (discount) {
          await discount.updateOne({ $set: { used: discount.used + 1 } });
        }
      }

      process.env.TZ = "Asia/Ho_Chi_Minh";

      let createDate = moment(date).format("YYYYMMDDHHmmss");

      let ipAddr =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

      let { vnpayConfig } = require("../../config/vnpay");

      const tmnCode = vnpayConfig.vnp_TmnCode;
      const secretKey = vnpayConfig.vnp_HashSecret;
      let vnpUrl = vnpayConfig.vnp_Url;
      let returnUrl = vnpayConfig.vnp_ReturnUrl;
      let bankCode = "";

      let locale = "vn";
      let currCode = "VND";
      let vnp_Params = {};
      vnp_Params["vnp_Version"] = "2.1.0";
      vnp_Params["vnp_Command"] = "pay";
      vnp_Params["vnp_TmnCode"] = tmnCode;
      vnp_Params["vnp_Locale"] = locale;
      vnp_Params["vnp_CurrCode"] = currCode;
      vnp_Params["vnp_TxnRef"] = orderCode;
      vnp_Params["vnp_OrderInfo"] =
        "Thanh toan cho khach hang " +
        removeVietnameseTones(customerName) +
        " ma đon hang: " +
        orderCode;
      vnp_Params["vnp_OrderType"] = "billpayment";
      vnp_Params["vnp_Amount"] = totalPrices * 100;
      vnp_Params["vnp_ReturnUrl"] = returnUrl;
      vnp_Params["vnp_IpAddr"] = ipAddr;
      vnp_Params["vnp_CreateDate"] = createDate;
      if (bankCode !== null && bankCode !== "") {
        vnp_Params["vnp_BankCode"] = bankCode;
      }

      vnp_Params = sortObject(vnp_Params);

      let querystring = require("qs");
      let signData = querystring.stringify(vnp_Params, { encode: false });
      let crypto = require("crypto");
      let hmac = crypto.createHmac("sha512", secretKey);
      let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
      vnp_Params["vnp_SecureHash"] = signed;
      vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
      res.status(200).json({ url: vnpUrl });
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  checkoutOnlineSuccess: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(404).json(errResponse.BAD_REQUEST);
      }
      const order = await Order.findOne({ orderCode: id });
      await order.updateOne({
        $set: { checkout: true, status: orderStatuses.ORDERED },
      });
      order.products.forEach(async (product) => {
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
      const responseOrder = await Order.findOne({
        orderCode: id,
        checkout: true,
      }).lean();
      res.status(200).json(responseOrder);
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  getAllOrders: async (req, res) => {
    try {
      const { page, size, customerId, status } = req.query;
      const pageParam = page ? parseInt(page) : 0;
      const sizeParam = size ? parseInt(size) : 10;
      let queries = {
        $and: [
          { customerId: customerId },
          { status: status ? status : { $nin: [orderStatuses.INCART] } },
        ],
      };
      const ordersCount = await Order.find(queries).count();
      const orders = await Order.find(queries)
        .sort({ createdAt: -1 })
        .skip(pageParam * sizeParam)
        .limit(sizeParam)
        .lean();
      const responseOrder = omitFieldsNotUsingInObject(orders, [
        "__v",
        "customerId",
        "customerName",
        "customerPhoneNumber",
      ]);
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

  getDetailOrder: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(200).json(errResponse.BAD_REQUEST);
      }
      const order = await Order.findById(id).lean();
      const { __v, ...other } = order;
      res.status(200).json(other);
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  cancelOrder: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(200).json(errResponse.BAD_REQUEST);
      }
      const order = await Order.findById(id);
      await order.updateOne({ $set: { status: orderStatuses.CANCEL } });
      res.status(200).json(order.id);
    } catch (error) {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
};

module.exports = customerOrderController;
