const { pool } = require("../config/db");

const addOrUpdateCartItem = async (cartToken, inventoryId, quantity) => {
  const query = `
    INSERT INTO cart_items (cart_token, inventory_id, quantity)
    VALUES ($1, $2, $3)
    ON CONFLICT (cart_token, inventory_id)
    DO UPDATE SET
      quantity = cart_items.quantity + EXCLUDED.quantity,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;

  const result = await pool.query(query, [cartToken, inventoryId, quantity]);
  return result.rows[0];
};

const getCartItems = async (cartToken) => {
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
      SELECT image_url
      FROM inventory_images
      WHERE inventory_images.inventory_id = inv.id
        AND inventory_images.is_display_image = true
      ORDER BY created_at ASC
      LIMIT 1
    ) img ON true
    WHERE ci.cart_token = $1
    ORDER BY ci.created_at DESC;
  `;

  const result = await pool.query(query, [cartToken]);
  return result.rows;
};

const updateCartItemQuantity = async (id, quantity) => {
  const query = `
    UPDATE cart_items
    SET quantity = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *;
  `;

  const result = await pool.query(query, [quantity, id]);
  return result.rows[0];
};

const deleteCartItem = async (id) => {
  const query = `
    DELETE FROM cart_items
    WHERE id = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0];
};

module.exports = {
  addOrUpdateCartItem,
  getCartItems,
  updateCartItemQuantity,
  deleteCartItem,
};
