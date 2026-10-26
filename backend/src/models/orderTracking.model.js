const { pool } = require("../config/db");

const RETURN_DAYS = 7;

const bad = (message, statusCode = 400) => {
  const e = new Error(message);
  e.statusCode = statusCode;
  return e;
};

const normPhone = (p) =>
  String(p || "")
    .replace(/\D/g, "")
    .slice(-10);

const getPayload = async (orderId) => {
  const orderResult = await pool.query(
    `SELECT id, user_id, name, phone, email, city, shipping_address, delivery_option,
            payment_method, subtotal, shipping_cost, total, status, created_at
     FROM orders WHERE id = $1;`,
    [orderId],
  );
  const order = orderResult.rows[0];
  if (!order) return null;

  const [items, history, ret] = await Promise.all([
    pool.query(
      `SELECT oi.id, oi.quantity, oi.unit_price, p.name AS product_name, b.brand_name,
              col.color_name, img.image_url AS display_image_url
       FROM order_items oi
       JOIN inventory inv ON inv.id = oi.inventory_id
       JOIN products p ON p.id = inv.product_id
       LEFT JOIN brands b ON b.brand_id = p.brand_id
       LEFT JOIN colors col ON col.color_id = inv.color_id
       LEFT JOIN LATERAL (
         SELECT image_url FROM inventory_images
         WHERE inventory_images.inventory_id = inv.id
         ORDER BY is_display_image DESC, created_at ASC LIMIT 1
       ) img ON true
       WHERE oi.order_id = $1 ORDER BY oi.id ASC;`,
      [orderId],
    ),
    pool.query(
      `SELECT status, created_at FROM order_status_history
       WHERE order_id = $1 ORDER BY created_at ASC, id ASC;`,
      [orderId],
    ),
    pool.query(
      `SELECT reason, note, status, created_at FROM return_requests WHERE order_id = $1;`,
      [orderId],
    ),
  ]);

  const deliveredRow = [...history.rows]
    .reverse()
    .find((h) => h.status === "delivered");
  const deadline = deliveredRow
    ? new Date(
        new Date(deliveredRow.created_at).getTime() + RETURN_DAYS * 86400000,
      )
    : null;

  const returnRequest = ret.rows[0] || null;

  return {
    ...order,
    items: items.rows,
    history: history.rows,
    return_request: returnRequest,
    return_deadline: deadline,
    can_return:
      order.status === "delivered" &&
      !!deadline &&
      deadline > new Date() &&
      !returnRequest,
  };
};

const createReturn = async (orderId, userId, reason, note) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const o = (
      await client.query(
        `SELECT id, user_id, status FROM orders WHERE id = $1 FOR UPDATE;`,
        [orderId],
      )
    ).rows[0];
    if (!o || o.user_id !== userId) throw bad("Order not found", 404);
    if (o.status !== "delivered")
      throw bad("Only delivered orders can be returned");

    const h = (
      await client.query(
        `SELECT MAX(created_at) AS at FROM order_status_history WHERE order_id = $1 AND status = 'delivered';`,
        [orderId],
      )
    ).rows[0];

    if (
      !h?.at ||
      new Date(h.at).getTime() + RETURN_DAYS * 86400000 < Date.now()
    ) {
      throw bad(`The ${RETURN_DAYS}-day return window has passed`);
    }

    const existing = await client.query(
      `SELECT 1 FROM return_requests WHERE order_id = $1;`,
      [orderId],
    );
    if (existing.rowCount > 0)
      throw bad("A return was already requested for this order");

    await client.query(
      `INSERT INTO return_requests (order_id, user_id, reason, note) VALUES ($1,$2,$3,$4);`,
      [orderId, userId, reason, note],
    );
    await client.query(
      `UPDATE orders SET status = 'return_requested', updated_at = CURRENT_TIMESTAMP WHERE id = $1;`,
      [orderId],
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { getPayload, createReturn, normPhone };
