const { pool } = require("../config/db");
const { sendMail } = require("../utils/mailer");

const notifyBackInStock = async (inventoryId) => {
  const subs = await pool.query(
    `SELECT s.id, u.email, u.name, p.name AS product_name
     FROM stock_subscriptions s
     JOIN users u ON u.id = s.user_id
     JOIN inventory inv ON inv.id = s.inventory_id
     JOIN products p ON p.id = inv.product_id
     WHERE s.inventory_id = $1 LIMIT 25;`,
    [inventoryId],
  );

  const base = process.env.FRONTEND_URL || "http://localhost:3000";

  await Promise.allSettled(
    subs.rows.map(async (s) => {
      await sendMail({
        to: s.email,
        subject: `${s.product_name} is back in stock!`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
            <h2>Good news, ${s.name}! 🧸</h2>
            <p><b>${s.product_name}</b> is back in stock at Play House.</p>
            <p><a href="${base}/productDetails/${encodeURIComponent(s.product_name)}" style="display:inline-block;background:#F5A623;color:#1E2B2B;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold">View product</a></p>
          </div>`,
      });
      await pool.query(`DELETE FROM stock_subscriptions WHERE id = $1;`, [
        s.id,
      ]);
    }),
  );
};

module.exports = { notifyBackInStock };
