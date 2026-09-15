const { pool } = require("../config/db");

const createBrand = async (data) => {
    const query = `
    INSERT INTO brands (brand_name, brand_image)
    VALUES ($1, $2)
    RETURNING *;
  `;
    const result = await pool.query(query, [data.brand_name, data.brand_image ?? null]);
    return result.rows[0];
};

const getBrands = async () => {
    const query = `
    SELECT * FROM brands
    ORDER BY created_at DESC;
  `;
    const result = await pool.query(query);
    return result.rows;
};

const getBrandById = async (brandId) => {
    const query = `
    SELECT * FROM brands
    WHERE brand_id = $1;
  `;
    const result = await pool.query(query, [brandId]);
    return result.rows[0];
};

const updateBrand = async (brandId, data) => {
    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(data)) {
        fields.push(`${key} = $${index}`);
        values.push(value);
        index++;
    }

    values.push(brandId);

    const query = `
    UPDATE brands
    SET ${fields.join(", ")},
        updated_at = CURRENT_TIMESTAMP
    WHERE brand_id = $${index}
    RETURNING *;
  `;

    const result = await pool.query(query, values);
    return result.rows[0];
};

const deleteBrand = async (brandId) => {
    const query = `
    DELETE FROM brands
    WHERE brand_id = $1
    RETURNING *;
  `;
    const result = await pool.query(query, [brandId]);
    return result.rows[0];
};

module.exports = {
    createBrand,
    getBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
};