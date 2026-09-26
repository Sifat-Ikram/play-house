const cartModel = require("../models/cart.model");

const addToCart = async ({ cart_token, inventory_id, quantity }, userId) => {
  if (!cart_token) {
    const error = new Error("cart_token is required");
    error.statusCode = 400;
    throw error;
  }
  if (!inventory_id) {
    const error = new Error("inventory_id is required");
    error.statusCode = 400;
    throw error;
  }

  const qty = Number(quantity) > 0 ? Number(quantity) : 1;
  return await cartModel.addOrUpdateCartItem({
    cartToken: cart_token,
    inventoryId: inventory_id,
    quantity: qty,
    userId,
  });
};

const getCart = async ({ cartToken, userId }) => {
  if (!userId && !cartToken) {
    const error = new Error("cart_token is required");
    error.statusCode = 400;
    throw error;
  }
  return await cartModel.getCartItems({ cartToken, userId });
};

const assertOwnership = (item, { userId, cartToken }) => {
  if (!item) {
    const error = new Error("Cart item not found");
    error.statusCode = 404;
    throw error;
  }
  const isOwner = userId
    ? item.user_id === userId
    : item.cart_token === cartToken && !item.user_id;

  if (!isOwner) {
    const error = new Error(
      "You do not have permission to modify this cart item",
    );
    error.statusCode = 403;
    throw error;
  }
};

const updateQuantity = async (id, quantity, ownerContext) => {
  const qty = Number(quantity);
  if (!qty || qty < 1) {
    const error = new Error("Quantity must be at least 1");
    error.statusCode = 400;
    throw error;
  }

  const item = await cartModel.findCartItemById(id);
  assertOwnership(item, ownerContext);

  return await cartModel.updateCartItemQuantity(id, qty);
};

const removeItem = async (id, ownerContext) => {
  const item = await cartModel.findCartItemById(id);
  assertOwnership(item, ownerContext);

  return await cartModel.deleteCartItem(id);
};

const mergeCart = async (userId, cartToken) => {
  return await cartModel.mergeGuestCartIntoUser(userId, cartToken);
};

module.exports = { addToCart, getCart, updateQuantity, removeItem, mergeCart };