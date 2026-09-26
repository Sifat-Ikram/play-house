const { pool } = require("../config/db");

const addOrUpdateCartItem = async ({
  cartToken,
  inventoryId,
  quantity,
  userId,
}) => {
  if (userId) {
    const query = `
      INSERT INTO cart_items (cart_token, inventory_id, quantity, user_id)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, inventory_id) WHERE user_id IS NOT NULL
      DO UPDATE SET
        quantity = cart_items.quantity + EXCLUDED.quantity,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const result = await pool.query(query, [
      cartToken || null,
      inventoryId,
      quantity,
      userId,
    ]);
    return result.rows[0];
  }

  const query = `
    INSERT INTO cart_items (cart_token, inventory_id, quantity, user_id)
    VALUES ($1, $2, $3, NULL)
    ON CONFLICT (cart_token, inventory_id) WHERE user_id IS NULL
    DO UPDATE SET
      quantity = cart_items.quantity + EXCLUDED.quantity,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;
  const result = await pool.query(query, [cartToken, inventoryId, quantity]);
  return result.rows[0];
};

const getCartItems = async ({ cartToken, userId }) => {
  const whereClause = userId
    ? `ci.user_id = $1`
    : `ci.cart_token = $1 AND ci.user_id IS NULL`;
  const param = userId || cartToken;

  const query = `
    SELECT
      ci.id,
      ci.quantity,
      ci.inventory_id,
      inv.selling_price,
      inv.stock_quantity,
      inv.mark_unavailable,
      inv.color_id,
      col.color_name,
      col.hex_code AS color_hex,
      p.id AS product_id,
      p.name AS product_name,
      b.brand_name,
      img.image_url AS display_image_url
    FROM cart_items ci
    JOIN inventory inv ON inv.id = ci.inventory_id
    JOIN products p ON p.id = inv.product_id
    LEFT JOIN brands b ON b.brand_id = p.brand_id
    LEFT JOIN colors col ON col.color_id = inv.color_id
    LEFT JOIN LATERAL (
      SELECT image_url FROM inventory_images
      WHERE inventory_images.inventory_id = inv.id AND inventory_images.is_display_image = true
      ORDER BY created_at ASC LIMIT 1
    ) img ON true
    WHERE ${whereClause}
    ORDER BY ci.created_at DESC;
  `;
  const result = await pool.query(query, [param]);
  return result.rows;
};

const findCartItemById = async (id) => {
  const result = await pool.query(`SELECT * FROM cart_items WHERE id = $1;`, [
    id,
  ]);
  return result.rows[0];
};

const updateCartItemQuantity = async (id, quantity) => {
  const query = `UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *;`;
  const result = await pool.query(query, [quantity, id]);
  return result.rows[0];
};

const deleteCartItem = async (id) => {
  const query = `DELETE FROM cart_items WHERE id = $1 RETURNING *;`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const mergeGuestCartIntoUser = async (userId, cartToken) => {
  if (!cartToken) return;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const guestItemsResult = await client.query(
      `SELECT * FROM cart_items WHERE cart_token = $1 AND user_id IS NULL;`,
      [cartToken],
    );

    for (const item of guestItemsResult.rows) {
      const existing = await client.query(
        `SELECT * FROM cart_items WHERE user_id = $1 AND inventory_id = $2;`,
        [userId, item.inventory_id],
      );

      if (existing.rows[0]) {
        await client.query(
          `UPDATE cart_items SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2;`,
          [item.quantity, existing.rows[0].id],
        );
        await client.query(`DELETE FROM cart_items WHERE id = $1;`, [item.id]);
      } else {
        await client.query(
          `UPDATE cart_items SET user_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2;`,
          [userId, item.id],
        );
      }
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  addOrUpdateCartItem,
  getCartItems,
  findCartItemById,
  updateCartItemQuantity,
  deleteCartItem,
  mergeGuestCartIntoUser,
};
