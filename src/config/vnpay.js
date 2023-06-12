const vnpayConfig = {
  vnp_TmnCode: "4B1FV6KL",
  vnp_HashSecret: "KIVMBINYKWYONAJYNUGAHRYANTLCECEN",
  vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  vnp_Api: "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
  vnp_ReturnUrl: "http://localhost:3000/order/checkoutSuccess",
};

module.exports = { vnpayConfig };
