const cartService = require("../services/cart.service");

const addToCart = async (req, res) => {
  try {
    const item = await cartService.addToCart(req.body);
    return res.status(201).json({
      success: true,
      message: "Item added to cart",
      data: item,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getCart = async (req, res) => {
  try {
    const { cartToken } = req.params;
    const items = await cartService.getCart(cartToken);
    return res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const updated = await cartService.updateQuantity(id, quantity);
    return res.status(200).json({
      success: true,
      message: "Quantity updated",
      data: updated,
    });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const removeItem = async (req, res) => {
  try {
    const { id } = req.params;
    await cartService.removeItem(id);
    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateQuantity,
  removeItem,
};
