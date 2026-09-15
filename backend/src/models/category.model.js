const { pool } = require("../config/db");

const createCategory = async (data) => {
    const query = `
    INSERT INTO categories (category_name, category_image)
    VALUES ($1, $2)
    RETURNING *;
  `;
    const result = await pool.query(query, [data.category_name, data.category_image ?? null]);
    return result.rows[0];
};

const getCategories = async () => {
    const query = `
    SELECT * FROM categories
    ORDER BY created_at DESC;
  `;
    const result = await pool.query(query);
    return result.rows;
};

const getCategoryById = async (categoryId) => {
    const query = `
    SELECT * FROM categories
    WHERE category_id = $1;
  `;
    const result = await pool.query(query, [categoryId]);
    return result.rows[0];
};

const updateCategory = async (categoryId, data) => {
    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(data)) {
        fields.push(`${key} = $${index}`);
        values.push(value);
        index++;
    }

    values.push(categoryId);

    const query = `
    UPDATE categories
    SET ${fields.join(", ")},
        updated_at = CURRENT_TIMESTAMP
    WHERE category_id = $${index}
    RETURNING *;
  `;

    const result = await pool.query(query, values);
    return result.rows[0];
};

const deleteCategory = async (categoryId) => {
    const query = `
    DELETE FROM categories
    WHERE category_id = $1
    RETURNING *;
  `;
    const result = await pool.query(query, [categoryId]);
    return result.rows[0];
};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};