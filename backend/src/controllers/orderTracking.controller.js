const model = require("../models/orderTracking.model");
const { pool } = require("../config/db");

const fail = (res, error) =>
  res
    .status(error.statusCode || 500)
    .json({ success: false, message: error.message });

const trackGuest = async (req, res) => {
  try {
    const { order_id, phone } = req.body;
    const payload = await model.getPayload(order_id);

    if (!payload || model.normPhone(payload.phone) !== model.normPhone(phone)) {
      return res
        .status(404)
        .json({ success: false, message: "No order found with these details" });
    }

    return res
      .status(200)
      .json({ success: true, data: { ...payload, can_return: false } });
  } catch (error) {
    return fail(res, error);
  }
};

const trackMine = async (req, res) => {
  try {
    const payload = await model.getPayload(req.params.id);
    if (!payload || payload.user_id !== req.user.id) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    return res.status(200).json({ success: true, data: payload });
  } catch (error) {
    return fail(res, error);
  }
};

const requestReturn = async (req, res) => {
  try {
    await model.createReturn(
      req.params.id,
      req.user.id,
      req.body.reason,
      req.body.note,
    );
    return res.status(201).json({ success: true, message: "Return requested" });
  } catch (error) {
    return fail(res, error);
  }
};

const guardOrderAccess = async (req, res, next) => {
  try {
    const r = await pool.query(`SELECT user_id FROM orders WHERE id = $1;`, [
      req.params.id,
    ]);
    const o = r.rows[0];
    if (o && o.user_id && o.user_id !== req.user?.id) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = { trackGuest, trackMine, requestReturn, guardOrderAccess };
