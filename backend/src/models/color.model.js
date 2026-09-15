const { pool } = require("../config/db");

const createColor = async (data) => {
    const query = `
    INSERT INTO colors (color_name, hex_code)
    VALUES ($1, $2)
    RETURNING *;
  `;
    const result = await pool.query(query, [data.color_name, data.hex_code ?? null]);
    return result.rows[0];
};

const getColors = async () => {
    const query = `
    SELECT * FROM colors
    ORDER BY created_at DESC;
  `;
    const result = await pool.query(query);
    return result.rows;
};

const getColorById = async (colorId) => {
    const query = `
    SELECT * FROM colors
    WHERE color_id = $1;
  `;
    const result = await pool.query(query, [colorId]);
    return result.rows[0];
};

const updateColor = async (colorId, data) => {
    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(data)) {
        fields.push(`${key} = $${index}`);
        values.push(value);
        index++;
    }

    values.push(colorId);

    const query = `
    UPDATE colors
    SET ${fields.join(", ")},
        updated_at = CURRENT_TIMESTAMP
    WHERE color_id = $${index}
    RETURNING *;
  `;

    const result = await pool.query(query, values);
    return result.rows[0];
};

const deleteColor = async (colorId) => {
    const query = `
    DELETE FROM colors
    WHERE color_id = $1
    RETURNING *;
  `;
    const result = await pool.query(query, [colorId]);
    return result.rows[0];
};

module.exports = {
    createColor,
    getColors,
    getColorById,
    updateColor,
    deleteColor,
};