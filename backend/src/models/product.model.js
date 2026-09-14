const { pool } = require("../config/db");

const createProduct = async (data) => {
    const query = `
    INSERT INTO products (
      category_id,
      brand_id,
      name,
      number_of_pieces,
      warranty_info,
      minimum_age_range,
      maximum_age_range,
      description,
      in_the_box,
      summary,
      return_and_refund_policy
    )
    VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10, $11
    )
    RETURNING *;
  `;

    const values = [
        data.category_id,
        data.brand_id,
        data.name,
        data.number_of_pieces ?? null,
        data.warranty_info ?? null,
        data.minimum_age_range ?? null,
        data.maximum_age_range ?? null,
        data.description ?? null,
        data.in_the_box ?? null,
        data.summary ?? null,
        data.return_and_refund_policy ?? null,
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};

const getProductById = async (id) => {
    const query = `
    SELECT *
    FROM products
    WHERE id = $1;
  `;

    const result = await pool.query(query, [id]);

    return result.rows[0];
};

const getProducts = async () => {
    const query = `
    SELECT *
    FROM products
    ORDER BY created_at DESC;
  `;

    const result = await pool.query(query);

    return result.rows;
};

const updateProduct = async (id, data) => {
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
    UPDATE products
    SET ${fields.join(", ")},
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $${index}
    RETURNING *;
  `;

    const result = await pool.query(query, values);

    return result.rows[0];
};

const deleteProduct = async (id) => {
    const query = `
    DELETE FROM products
    WHERE id = $1
    RETURNING *;
  `;

    const result = await pool.query(query, [id]);

    return result.rows[0];
};

module.exports = {
    createProduct,
    getProductById,
    getProducts,
    updateProduct,
    deleteProduct,
};