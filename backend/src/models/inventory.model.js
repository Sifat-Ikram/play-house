const { pool } = require("../config/db");

const createInventory = async (data) => {
  const query = `
    INSERT INTO inventory (
      product_id,
      color_id,
      sku,
      stock_quantity,
      buying_price,
      selling_price,
      min_wholesale_qty,
      wholesale_price,
      mark_unavailable,
      applicable_tax_percent,
      is_featured
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *;
  `;

  const values = [
    data.product_id,
    data.color_id ?? null,
    data.sku ?? null,
    data.stock_quantity ?? data.quantity ?? 0,
    data.buying_price ?? data.base_price ?? 0,
    data.selling_price,
    data.min_wholesale_qty ?? 0,
    data.wholesale_price ?? 0,
    data.mark_unavailable ?? false,
    data.applicable_tax_percent ?? null,
    data.is_featured ?? false,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const getInventoryById = async (id) => {
  const query = `
    SELECT *
    FROM inventory
    WHERE id = $1;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};

const getInventoryByProductId = async (productId) => {
  const query = `
    SELECT *
    FROM inventory
    WHERE product_id = $1;
  `;

  const result = await pool.query(query, [productId]);

  return result.rows;
};

const updateInventory = async (id, data) => {
  const fields = [];
  const values = [];

  let index = 1;

  for (const [key, value] of Object.entries(data)) {
    fields.push(`${key} = $${index}`);
    values.push(value);
    index++;
  }

  values.push(id);

  const query = `
    UPDATE inventory
    SET ${fields.join(", ")},
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $${index}
    RETURNING *;
  `;

  const result = await pool.query(query, values);

  return result.rows[0];
};

const deleteInventory = async (id) => {
  const query = `
    DELETE FROM inventory
    WHERE id = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};

const getFeaturedInventories = async () => {
  const query = `
    SELECT *
    FROM inventory
    WHERE is_featured = true
    ORDER BY created_at DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
};

module.exports = {
  createInventory,
  getInventoryById,
  getInventoryByProductId,
  updateInventory,
  deleteInventory,
  getFeaturedInventories,
};