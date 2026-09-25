const orderService = require("../services/order.service");

const placeOrder = async (req, res) => {
  try {
    const order = await orderService.placeOrder(req.body);
    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderService.fetchOrderById(id);
    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  placeOrder,
  getOrderById,
};
