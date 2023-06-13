const Order = require("../models/order");
const { errResponse } = require("../constants/responseMessage");
const { omitFieldsNotUsingInObject } = require("../../utils/arrayMethods");
const { deleteImage } = require("../firebase/firebaseServices");
const moment = require("moment");
const orderStatuses = require("../constants/orderStatus");

const handleGetAmount = (orders, month) => {
  let successOrder = 0;
  let createdOrder = 0;

  orders.forEach((order) => {
    if (moment(order.updatedAt).month() === month) {
      createdOrder += 1;
      if (order.status === orderStatuses.DONE) {
        successOrder += 1;
      }
    }
  });

  return { createdOrder, successOrder };
};

const handleGetAmountPerYear = async (year) => {
  let successOrder = 0;
  let createdOrder = 0;

  const startDate = moment(new Date(year, 0, 1, 0, 0, 0))
    .startOf("year")
    .format();
  const endDate = moment(new Date(year, 11, 1, 0, 0, 0)).endOf("year").format();
  const queries = {
    $and: [{ updatedAt: { $lte: endDate, $gte: startDate } }],
  };
  const orders = await Order.find(queries).lean();

  orders.forEach((order) => {
    createdOrder += 1;
    if (order.status === orderStatuses.DONE) {
      successOrder += 1;
    }
  });

  return { createdOrder, successOrder };
};

const profitController = {
  getProfitPerMonth: async (req, res) => {
    try {
      const { month, year } = req.query;
      let queryMonth = month ? month : moment().month();
      let queryYear = year ? year : moment().year();
      const startDate = moment(
        new Date(queryYear, queryMonth, 1, 0, 0, 0)
      ).format();
      const endDate = moment(new Date(queryYear, queryMonth, 1, 0, 0, 0))
        .endOf("month")
        .format();

      let queries = {
        $and: [{ updatedAt: { $lte: endDate, $gte: startDate } }],
      };

      const orders = await Order.find(queries).lean();

      let totalSalesFigures = 0;
      let orderCreated = 0;
      let successOrder = 0;
      let processingOrder = 0;
      let cancelOrder = 0;

      orders.forEach((order) => {
        if (order.status === orderStatuses.DONE) {
          totalSalesFigures += order.totalPrices;
          successOrder += 1;
        }
        if (order.status !== orderStatuses.INCART) {
          orderCreated += 1;
        }
        if (
          order.status === orderStatuses.ORDERED ||
          order.status === orderStatuses.DELIVERING
        ) {
          processingOrder += 1;
        }
        if (
          order.status === orderStatuses.CANCEL ||
          order.status === orderStatuses.REPAY
        ) {
          cancelOrder += 1;
        }
      });

      res.status(200).json({
        totalSalesFigures,
        orderCreated,
        successOrder,
        processingOrder,
        cancelOrder,
      });
    } catch {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  getProfitEachMonth: async (req, res) => {
    try {
      const { startMonth, endMonth, year } = req.query;
      let queryStartMonth = 0;
      let queryEndMonth = 0;
      if (startMonth > endMonth) {
        queryStartMonth = +endMonth
          ? +endMonth
          : moment().startOf("year").month();
        queryEndMonth = startMonth ? startMonth : moment().month();
      } else {
        queryStartMonth = +startMonth
          ? +startMonth
          : moment().startOf("year").month();
        queryEndMonth = +endMonth ? +endMonth : moment().month();
      }

      let queryYear = year ? year : moment().year();
      const startDate = moment(
        new Date(queryYear, queryStartMonth, 1, 0, 0, 0)
      ).format();
      const endDate = moment(new Date(queryYear, queryEndMonth, 1, 0, 0, 0))
        .endOf("month")
        .format();

      let queries = {
        $and: [{ updatedAt: { $lte: endDate, $gte: startDate } }],
      };

      const orders = await Order.find(queries).lean();
      let salesFiguresEachMonth = [];
      for (let i = queryStartMonth; i <= queryEndMonth; i++) {
        switch (i) {
          case 1: {
            const data = handleGetAmount(orders, 1);
            salesFiguresEachMonth = [
              ...salesFiguresEachMonth,
              { id: 1, month: "february", ...data },
            ];
            break;
          }
          case 2: {
            const data = handleGetAmount(orders, 2);
            salesFiguresEachMonth = [
              ...salesFiguresEachMonth,
              { id: 2, month: "march", ...data },
            ];
            break;
          }
          case 3: {
            const data = handleGetAmount(orders, 3);
            salesFiguresEachMonth = [
              ...salesFiguresEachMonth,
              { id: 3, month: "april", ...data },
            ];
            break;
          }
          case 4: {
            const data = handleGetAmount(orders, 4);
            salesFiguresEachMonth = [
              ...salesFiguresEachMonth,
              { id: 4, month: "may", ...data },
            ];
            break;
          }
          case 5: {
            const data = handleGetAmount(orders, 5);
            salesFiguresEachMonth = [
              ...salesFiguresEachMonth,
              { id: 5, month: "june", ...data },
            ];
            break;
          }
          case 6: {
            const data = handleGetAmount(orders, 6);
            salesFiguresEachMonth = [
              ...salesFiguresEachMonth,
              { id: 6, month: "july", ...data },
            ];
            break;
          }
          case 7: {
            const data = handleGetAmount(orders, 7);
            salesFiguresEachMonth = [
              ...salesFiguresEachMonth,
              { id: 7, month: "august", ...data },
            ];
            break;
          }
          case 8: {
            const data = handleGetAmount(orders, 8);
            salesFiguresEachMonth = [
              ...salesFiguresEachMonth,
              { id: 8, month: "september", ...data },
            ];
            break;
          }
          case 9: {
            const data = handleGetAmount(orders, 9);
            salesFiguresEachMonth = [
              ...salesFiguresEachMonth,
              { id: 9, month: "october", ...data },
            ];
            break;
          }
          case 10: {
            const data = handleGetAmount(orders, 10);
            salesFiguresEachMonth = [
              ...salesFiguresEachMonth,
              { id: 10, month: "november", ...data },
            ];
            break;
          }
          case 11: {
            const data = handleGetAmount(orders, 11);
            salesFiguresEachMonth = [
              ...salesFiguresEachMonth,
              { id: 11, month: "december", ...data },
            ];
            break;
          }
          default: {
            const data = handleGetAmount(orders, 0);
            salesFiguresEachMonth = [
              ...salesFiguresEachMonth,
              { id: 0, month: "january", ...data },
            ];
            break;
          }
        }
      }

      // let labels = [];
      // let createdOrder = [];
      // let successOrder = [];
      // salesFiguresEachMonth.forEach((item) => {
      //   labels.push(item.month);
      //   createdOrder.push(item.createdOrder);
      //   successOrder.push(item.successOrder);
      // });

      res.status(200).json(salesFiguresEachMonth);
    } catch {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  getProfitPerYear: async (req, res) => {
    try {
      const { year } = req.query;
      let queryYear = year ? year : moment().year();
      const startDate = moment(new Date(queryYear, 0, 1, 0, 0, 0)).format();
      const endDate = moment(new Date(queryYear, 11, 1, 0, 0, 0))
        .endOf("month")
        .format();

      let queries = {
        $and: [{ updatedAt: { $lte: endDate, $gte: startDate } }],
      };

      const orders = await Order.find(queries).lean();

      let totalSalesFigures = 0;
      let orderCreated = 0;
      let successOrder = 0;
      let processingOrder = 0;
      let cancelOrder = 0;

      orders.forEach((order) => {
        if (order.status === orderStatuses.DONE) {
          totalSalesFigures += order.totalPrices;
          successOrder += 1;
        }
        if (order.status !== orderStatuses.INCART) {
          orderCreated += 1;
        }
        if (
          order.status === orderStatuses.ORDERED ||
          order.status === orderStatuses.DELIVERING
        ) {
          processingOrder += 1;
        }
        if (
          order.status === orderStatuses.CANCEL ||
          order.status === orderStatuses.REPAY
        ) {
          cancelOrder += 1;
        }
      });

      res.status(200).json({
        totalSalesFigures,
        orderCreated,
        successOrder,
        processingOrder,
        cancelOrder,
      });
    } catch {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
  getProfitEachYear: async (req, res) => {
    try {
      const { startYear = 2023, endYear = 2023 } = req.query;
      let queryStartYear = 0;
      let queryEndYear = 0;
      if (+startYear > +endYear) {
        queryStartYear = +endYear;
        queryEndYear = +startYear;
      } else {
        queryStartYear = +startYear;
        queryEndYear = +endYear;
      }

      // const startDate = moment(new Date(queryStartYear, 0, 1, 0, 0, 0))
      //   .startOf("year")
      //   .format();
      // const endDate = moment(new Date(queryEndYear, 11, 1, 0, 0, 0))
      //   .endOf("year")
      //   .format();

      // let queries = {
      //   $and: [{ updatedAt: { $lte: endDate, $gte: startDate } }],
      // };

      let salesFiguresEachYear = [];
      for (let i = queryStartYear; i <= queryEndYear; i++) {
        switch (i) {
          case 2018: {
            let data = {};
            await handleGetAmountPerYear(2018).then((res) => {
              data = res;
            });
            salesFiguresEachYear = [
              ...salesFiguresEachYear,
              { id: 2018, year: 2018, ...data },
            ];
            break;
          }
          case 2019: {
            let data = {};
            await handleGetAmountPerYear(2019).then((res) => {
              data = res;
            });
            salesFiguresEachYear = [
              ...salesFiguresEachYear,
              { id: 2019, year: 2019, ...data },
            ];
            break;
          }
          case 2020: {
            let data = {};
            await handleGetAmountPerYear(2020).then((res) => {
              data = res;
            });
            salesFiguresEachYear = [
              ...salesFiguresEachYear,
              { id: 2020, year: 2020, ...data },
            ];
            break;
          }
          case 2021: {
            let data = {};
            await handleGetAmountPerYear(2021).then((res) => {
              data = res;
            });
            salesFiguresEachYear = [
              ...salesFiguresEachYear,
              { id: 2021, year: 2021, ...data },
            ];
            break;
          }
          case 2022: {
            let data = {};
            await handleGetAmountPerYear(2022).then((res) => {
              data = res;
            });
            salesFiguresEachYear = [
              ...salesFiguresEachYear,
              { id: 2022, year: 2022, ...data },
            ];
            break;
          }
          case 2023: {
            let data = {};
            await handleGetAmountPerYear(2023).then((res) => {
              data = res;
            });
            salesFiguresEachYear = [
              ...salesFiguresEachYear,
              { id: 2023, year: 2023, ...data },
            ];
            break;
          }
          default: {
            let data = {};
            await handleGetAmountPerYear(2017).then((res) => {
              data = res;
            });
            salesFiguresEachYear = [
              ...salesFiguresEachYear,
              { id: 2017, year: 2017, ...data },
            ];
            break;
          }
        }
      }

      // let labels = [];
      // let createdOrder = [];
      // let successOrder = [];
      // salesFiguresEachMonth.forEach((item) => {
      //   labels.push(item.month);
      //   createdOrder.push(item.createdOrder);
      //   successOrder.push(item.successOrder);
      // });

      res.status(200).json(salesFiguresEachYear);
    } catch {
      res.status(500).json(errResponse.SERVER_ERROR);
    }
  },
};

module.exports = profitController;
