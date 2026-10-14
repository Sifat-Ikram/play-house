const adminModel = require("../models/admin.model");

const bad = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const validateInventory = (d, isCreate) => {
  if (isCreate && !d.product_id) throw bad("product_id is required");

  if (
    d.selling_price === undefined ||
    d.selling_price === "" ||
    Number(d.selling_price) < 0
  ) {
    throw bad("A valid selling price is required");
  }

  if (Number(d.stock_quantity || 0) < 0) throw bad("Stock cannot be negative");

  const hasPrice = d.wholesale_price !== "" && d.wholesale_price != null;
  const hasQty = d.min_wholesale_qty !== "" && d.min_wholesale_qty != null;
  if (hasPrice !== hasQty) {
    throw bad(
      "Wholesale price and minimum wholesale quantity must be filled together",
    );
  }
};

const getStats = () => adminModel.getStats();
const listUsers = () => adminModel.listUsers();
const listProducts = (q) => adminModel.listProducts(q?.trim() || null);

const getProduct = async (id) => {
  const product = await adminModel.getProductById(id);
  if (!product) throw bad("Product not found", 404);
  return product;
};

const setFeatured = async (id, featured) => {
  if (typeof featured !== "boolean")
    throw bad("featured must be true or false");
  await getProduct(id);
  return adminModel.setProductFeatured(id, featured);
};

const createInventory = async (data) => {
  validateInventory(data, true);
  return adminModel.createInventory(data);
};

const updateInventory = async (id, data) => {
  validateInventory(data, false);
  const updated = await adminModel.updateInventory(id, data);
  if (!updated) throw bad("Inventory not found", 404);
  return updated;
};

const deleteInventory = async (id) => {
  const deleted = await adminModel.deleteInventory(id);
  if (!deleted) throw bad("Inventory not found", 404);
  return deleted;
};

module.exports = {
  getStats,
  listUsers,
  listProducts,
  getProduct,
  setFeatured,
  createInventory,
  updateInventory,
  deleteInventory,
};
