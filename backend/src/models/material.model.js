const { pool } = require("../config/db");

const createMaterial = async (data) => {
  const result = await pool.query(
    `INSERT INTO materials (material_name) VALUES ($1) RETURNING *;`,
    [data.material_name],
  );
  return result.rows[0];
};

const getMaterials = async () => {
  const result = await pool.query(
    `SELECT * FROM materials ORDER BY material_name ASC;`,
  );
  return result.rows;
};

const updateMaterial = async (id, data) => {
  const result = await pool.query(
    `UPDATE materials SET material_name = $1, updated_at = CURRENT_TIMESTAMP
     WHERE material_id = $2 RETURNING *;`,
    [data.material_name, id],
  );
  return result.rows[0];
};

const deleteMaterial = async (id) => {
  const result = await pool.query(
    `DELETE FROM materials WHERE material_id = $1 RETURNING *;`,
    [id],
  );
  return result.rows[0];
};

module.exports = {
  createMaterial,
  getMaterials,
  updateMaterial,
  deleteMaterial,
};
