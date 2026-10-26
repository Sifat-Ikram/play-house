const { pool } = require("../config/db");

const STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
  "return_requested",
  "returned",
  "refunded",
];

const RELEASED = ["cancelled", "returned", "refunded"];

// ---------- Orders ----------
const listOrders = async (status, q) => {
  const result = await pool.query(
    `
    SELECT
      o.id, o.user_id, o.name, o.email, o.phone, o.city, o.total, o.status,
      o.payment_method, o.created_at,
      (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id)::int AS item_count
    FROM orders o
    WHERE ($1::text IS NULL OR o.status = $1::text)
      AND ($2::text IS NULL
           OR o.name ILIKE $2::text
           OR o.phone ILIKE $2::text
           OR o.id::text ILIKE $2::text)
    ORDER BY o.created_at DESC;
    `,
    [status || null, q ? `%${q}%` : null],
  );
  return result.rows;
};

const getStatusCounts = async () => {
  const result = await pool.query(
    `SELECT status, COUNT(*)::int AS count FROM orders GROUP BY status;`,
  );
  const counts = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  let all = 0;
  result.rows.forEach((r) => {
    counts[r.status] = r.count;
    all += r.count;
  });
  counts.all = all;
  return counts;
};

const getOrderDetail = async (id) => {
  const orderResult = await pool.query(
    `SELECT o.*, u.email AS account_email, u.name AS account_name
     FROM orders o LEFT JOIN users u ON u.id = o.user_id
     WHERE o.id = $1;`,
    [id],
  );
  const order = orderResult.rows[0];
  if (!order) return null;

  const items = await pool.query(
    `
    SELECT
      oi.id, oi.inventory_id, oi.quantity, oi.unit_price,
      p.id AS product_id, p.name AS product_name,
      b.brand_name, c.category_name,
      col.color_name, col.hex_code AS color_hex,
      inv.sku,
      img.image_url AS display_image_url
    FROM order_items oi
    JOIN inventory inv ON inv.id = oi.inventory_id
    JOIN products p ON p.id = inv.product_id
    LEFT JOIN brands b ON b.brand_id = p.brand_id
    LEFT JOIN categories c ON c.category_id = p.category_id
    LEFT JOIN colors col ON col.color_id = inv.color_id
    LEFT JOIN LATERAL (
      SELECT image_url FROM inventory_images
      WHERE inventory_images.inventory_id = inv.id
      ORDER BY is_display_image DESC, created_at ASC LIMIT 1
    ) img ON true
    WHERE oi.order_id = $1
    ORDER BY oi.id ASC;
    `,
    [id],
  );

  const ret = await pool.query(
    `SELECT reason, note, status, created_at FROM return_requests WHERE order_id = $1;`,
    [id],
  );

  return { ...order, items: items.rows, return_request: ret.rows[0] || null };
};

const updateOrderStatus = async (id, newStatus) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const current = await client.query(
      `SELECT id, status FROM orders WHERE id = $1 FOR UPDATE;`,
      [id],
    );
    const order = current.rows[0];

    if (!order) {
      await client.query("ROLLBACK");
      return null;
    }

    const wasReleased = RELEASED.includes(order.status);
    const willRelease = RELEASED.includes(newStatus);

    if (wasReleased !== willRelease) {
      const items = await client.query(
        `SELECT inventory_id, quantity FROM order_items WHERE order_id = $1;`,
        [id],
      );

      if (willRelease) {
        for (const it of items.rows) {
          await client.query(
            `UPDATE inventory SET stock_quantity = stock_quantity + $1 WHERE id = $2;`,
            [it.quantity, it.inventory_id],
          );
        }
      } else {
        for (const it of items.rows) {
          const r = await client.query(
            `UPDATE inventory SET stock_quantity = stock_quantity - $1
             WHERE id = $2 AND stock_quantity >= $1 RETURNING id;`,
            [it.quantity, it.inventory_id],
          );
          if (r.rowCount === 0) {
            const error = new Error(
              "Not enough stock to re-activate this order",
            );
            error.statusCode = 400;
            throw error;
          }
        }
      }
    }

    if (newStatus === "returned" || newStatus === "refunded") {
      await client.query(
        `UPDATE return_requests SET status = 'approved' WHERE order_id = $1;`,
        [id],
      );
    } else if (newStatus === "delivered") {
      await client.query(
        `UPDATE return_requests SET status = 'rejected' WHERE order_id = $1;`,
        [id],
      );
    }

    const updated = await client.query(
      `UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *;`,
      [newStatus, id],
    );

    await client.query("COMMIT");
    return updated.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// ---------- Carts ----------
const listCarts = async () => {
  const result = await pool.query(
    `
    SELECT
      ci.id, ci.user_id, ci.cart_token, ci.inventory_id, ci.quantity, ci.created_at, ci.updated_at,
      u.name AS user_name, u.email AS user_email,
      p.name AS product_name, b.brand_name,
      col.color_name, col.hex_code AS color_hex,
      inv.selling_price, inv.stock_quantity,
      img.image_url AS display_image_url
    FROM cart_items ci
    JOIN inventory inv ON inv.id = ci.inventory_id
    JOIN products p ON p.id = inv.product_id
    LEFT JOIN brands b ON b.brand_id = p.brand_id
    LEFT JOIN colors col ON col.color_id = inv.color_id
    LEFT JOIN users u ON u.id = ci.user_id
    LEFT JOIN LATERAL (
      SELECT image_url FROM inventory_images
      WHERE inventory_images.inventory_id = inv.id
      ORDER BY is_display_image DESC, created_at ASC LIMIT 1
    ) img ON true
    ORDER BY ci.updated_at DESC;
    `,
  );
  return result.rows;
};

const updateCartItem = async (id, quantity) => {
  const result = await pool.query(
    `UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *;`,
    [quantity, id],
  );
  return result.rows[0];
};

const deleteCartItem = async (id) => {
  const result = await pool.query(
    `DELETE FROM cart_items WHERE id = $1 RETURNING *;`,
    [id],
  );
  return result.rows[0];
};

module.exports = {
  STATUSES,
  listOrders,
  getStatusCounts,
  getOrderDetail,
  updateOrderStatus,
  listCarts,
  updateCartItem,
  deleteCartItem,
};
