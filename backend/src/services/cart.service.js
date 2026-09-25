const cartModel = require("../models/cart.model");

const addToCart = async (data) => {
  const { cart_token, inventory_id, quantity } = data;

  if (!cart_token) {
    throw new Error("cart_token is required");
  }

  if (!inventory_id) {
    throw new Error("inventory_id is required");
  }

  const qty = Number(quantity) > 0 ? Number(quantity) : 1;

  return await cartModel.addOrUpdateCartItem(cart_token, inventory_id, qty);
};

const getCart = async (cartToken) => {
  if (!cartToken) {
    throw new Error("cart_token is required");
  }

  return await cartModel.getCartItems(cartToken);
};

const updateQuantity = async (id, quantity) => {
  const qty = Number(quantity);

  if (!qty || qty < 1) {
    throw new Error("Quantity must be at least 1");
  }

  const updated = await cartModel.updateCartItemQuantity(id, qty);

  if (!updated) {
    const error = new Error("Cart item not found");
    error.statusCode = 404;
    throw error;
  }

  return updated;
};

const removeItem = async (id) => {
  const deleted = await cartModel.deleteCartItem(id);

  if (!deleted) {
    const error = new Error("Cart item not found");
    error.statusCode = 404;
    throw error;
  }

  return deleted;
};

module.exports = {
  addToCart,
  getCart,
  updateQuantity,
  removeItem,
};
