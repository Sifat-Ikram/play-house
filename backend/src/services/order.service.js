const orderModel = require("../models/order.model");

const REQUIRED_FIELDS = [
  "cart_token",
  "name",
  "phone",
  "shipping_address",
  "city",
  "delivery_option",
];

const placeOrder = async (data) => {
  for (const field of REQUIRED_FIELDS) {
    if (!data[field]) {
      const error = new Error(`${field} is required`);
      error.statusCode = 400;
      throw error;
    }
  }

  if (!["INSIDE_DHAKA", "OUTSIDE_DHAKA"].includes(data.delivery_option)) {
    const error = new Error("Invalid delivery_option");
    error.statusCode = 400;
    throw error;
  }

  if (data.payment_method && !["cod", "card"].includes(data.payment_method)) {
    const error = new Error("Invalid payment_method");
    error.statusCode = 400;
    throw error;
  }

  return await orderModel.createOrder(data);
};

const fetchOrderById = async (id) => {
  const order = await orderModel.getOrderById(id);

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  return order;
};

const fetchOrdersByUserId = async (userId) => {
  return await orderModel.getOrdersByUserId(userId);
};

module.exports = {
  placeOrder,
  fetchOrderById,
  fetchOrdersByUserId,
};
