const { pool } = require("../config/db");

const createInventory = async (data) => {
    const query = `
    INSERT INTO inventory (
      product_id,
      quantity,
      mark_unavailable,
      base_price,
      selling_price,
      applicable_tax_percent,
      color_id,
      is_featured
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;

    const values = [
        data.product_id,
        data.quantity,
        data.mark_unavailable ?? false,
        data.base_price,
        data.selling_price,
        data.applicable_tax_percent ?? null,
        data.color_id ?? null,
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

module.exports = {
    createInventory,
    getInventoryById,
    getInventoryByProductId,
    updateInventory,
    deleteInventory,
};