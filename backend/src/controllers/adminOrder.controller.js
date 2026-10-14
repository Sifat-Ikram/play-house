const model = require("../models/adminOrder.model");

const fail = (res, error) =>
  res
    .status(error.statusCode || 500)
    .json({ success: false, message: error.message });

const listOrders = async (req, res) => {
  try {
    const { status, q } = req.query;

    if (status && status !== "all" && !model.STATUSES.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const [orders, counts] = await Promise.all([
      model.listOrders(
        status && status !== "all" ? status : null,
        q?.trim() || null,
      ),
      model.getStatusCounts(),
    ]);

    return res.status(200).json({ success: true, data: { orders, counts } });
  } catch (error) {
    return fail(res, error);
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await model.getOrderDetail(req.params.id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    return fail(res, error);
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!model.STATUSES.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const updated = await model.updateOrderStatus(req.params.id, status);
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return fail(res, error);
  }
};

const listCarts = async (req, res) => {
  try {
    return res
      .status(200)
      .json({ success: true, data: await model.listCarts() });
  } catch (error) {
    return fail(res, error);
  }
};

const updateCartItem = async (req, res) => {
  try {
    const qty = Number(req.body.quantity);

    if (!Number.isInteger(qty) || qty < 1) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Quantity must be a whole number, at least 1",
        });
    }

    const updated = await model.updateCartItem(req.params.id, qty);
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Cart item not found" });

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return fail(res, error);
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const deleted = await model.deleteCartItem(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Cart item not found" });
    return res.status(200).json({ success: true, data: deleted });
  } catch (error) {
    return fail(res, error);
  }
};

module.exports = {
  listOrders,
  getOrder,
  updateStatus,
  listCarts,
  updateCartItem,
  deleteCartItem,
};
