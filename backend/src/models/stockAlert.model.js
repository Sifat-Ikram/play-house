const { pool } = require("../config/db");

const mine = async (userId) => {
  const r = await pool.query(
    `SELECT inventory_id FROM stock_subscriptions WHERE user_id = $1;`,
    [userId],
  );
  return r.rows.map((x) => x.inventory_id);
};

const subscribe = (userId, inventoryId) =>
  pool.query(
    `INSERT INTO stock_subscriptions (user_id, inventory_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;`,
    [userId, inventoryId],
  );

const unsubscribe = (userId, inventoryId) =>
  pool.query(
    `DELETE FROM stock_subscriptions WHERE user_id = $1 AND inventory_id = $2;`,
    [userId, inventoryId],
  );

module.exports = { mine, subscribe, unsubscribe };
