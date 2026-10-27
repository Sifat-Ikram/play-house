const { pool } = require("../config/db");

const SOLD = `o.status NOT IN ('cancelled','returned','refunded')`;

const getAnalytics = async (days) => {
  const d = Math.min(Math.max(Number(days) || 30, 7), 365);

  const [sales, status, top] = await Promise.all([
    pool.query(
      `SELECT to_char(g::date, 'DD Mon') AS day,
              COALESCE(SUM(o.total), 0)::float AS revenue,
              COUNT(o.id)::int AS orders
       FROM generate_series(CURRENT_DATE - ($1::int - 1), CURRENT_DATE, interval '1 day') g
       LEFT JOIN orders o ON o.created_at::date = g::date AND ${SOLD}
       GROUP BY g ORDER BY g;`,
      [d],
    ),
    pool.query(
      `SELECT status, COUNT(*)::int AS count FROM orders GROUP BY status;`,
    ),
    pool.query(
      `SELECT p.name, SUM(oi.quantity)::int AS units, SUM(oi.quantity * oi.unit_price)::float AS revenue
       FROM order_items oi
       JOIN orders o ON o.id = oi.order_id AND ${SOLD}
       JOIN inventory inv ON inv.id = oi.inventory_id
       JOIN products p ON p.id = inv.product_id
       WHERE o.created_at >= CURRENT_DATE - ($1::int - 1)
       GROUP BY p.id, p.name ORDER BY units DESC LIMIT 5;`,
      [d],
    ),
  ]);

  return { sales: sales.rows, status: status.rows, top: top.rows };
};

const getLowStock = async () => {
  const r = await pool.query(
    `SELECT inv.id, p.id AS product_id, p.name, col.color_name, inv.sku, inv.stock_quantity
     FROM inventory inv
     JOIN products p ON p.id = inv.product_id
     LEFT JOIN colors col ON col.color_id = inv.color_id
     WHERE inv.stock_quantity <= 5
     ORDER BY inv.stock_quantity ASC, p.name ASC LIMIT 50;`,
  );
  return r.rows;
};

const inventoryRows = async () =>
  (
    await pool.query(
      `SELECT p.name AS product, b.brand_name AS brand, c.category_name AS category,
              col.color_name AS colour, inv.sku, inv.stock_quantity AS stock,
              inv.buying_price, inv.selling_price, inv.wholesale_price, inv.min_wholesale_qty
       FROM inventory inv
       JOIN products p ON p.id = inv.product_id
       LEFT JOIN brands b ON b.brand_id = p.brand_id
       LEFT JOIN categories c ON c.category_id = p.category_id
       LEFT JOIN colors col ON col.color_id = inv.color_id
       ORDER BY p.name;`,
    )
  ).rows;

const orderRows = async () =>
  (
    await pool.query(
      `SELECT id AS order_id, created_at::date AS date, name, phone, city,
              payment_method, subtotal, shipping_cost, total, status
       FROM orders ORDER BY created_at DESC;`,
    )
  ).rows;

module.exports = { getAnalytics, getLowStock, inventoryRows, orderRows };
