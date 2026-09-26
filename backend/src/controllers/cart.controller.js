const cartService = require("../services/cart.service");

const addToCart = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const item = await cartService.addToCart(req.body, userId);
    return res
      .status(201)
      .json({ success: true, message: "Item added to cart", data: item });
  } catch (error) {
    return res
      .status(error.statusCode || 400)
      .json({ success: false, message: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const cartToken = req.query.cartToken;
    const items = await cartService.getCart({ cartToken, userId });
    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    return res
      .status(error.statusCode || 400)
      .json({ success: false, message: error.message });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const cartToken = req.body.cart_token;
    const { id } = req.params;
    const { quantity } = req.body;
    const updated = await cartService.updateQuantity(id, quantity, {
      userId,
      cartToken,
    });
    return res
      .status(200)
      .json({ success: true, message: "Quantity updated", data: updated });
  } catch (error) {
    return res
      .status(error.statusCode || 400)
      .json({ success: false, message: error.message });
  }
};

const removeItem = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const cartToken = req.body.cart_token || req.query.cartToken;
    const { id } = req.params;
    await cartService.removeItem(id, { userId, cartToken });
    return res
      .status(200)
      .json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    return res
      .status(error.statusCode || 400)
      .json({ success: false, message: error.message });
  }
};

const mergeCart = async (req, res) => {
  try {
    await cartService.mergeCart(req.user.id, req.body.cart_token);
    return res
      .status(200)
      .json({ success: true, message: "Cart merged successfully" });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
};

module.exports = { addToCart, getCart, updateQuantity, removeItem, mergeCart };