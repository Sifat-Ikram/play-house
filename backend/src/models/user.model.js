const { pool } = require("../config/db");

const createUser = async (data) => {
  const query = `
    INSERT INTO users (name, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, phone_number, addresses, created_at;
  `;

  const result = await pool.query(query, [
    data.name,
    data.email,
    data.password_hash,
  ]);
  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE LOWER(email) = LOWER($1);`;
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

const getUserById = async (id) => {
  const query = `
    SELECT id, name, email, phone_number, addresses, created_at
    FROM users WHERE id = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const updateUser = async (id, data) => {
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
    UPDATE users
    SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $${index}
    RETURNING id, name, email, phone_number, addresses, updated_at;
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteUser = async (id) => {
  const query = `DELETE FROM users WHERE id = $1 RETURNING id;`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const saveRefreshToken = async (userId, token, expiresAt) => {
  const query = `
    INSERT INTO refresh_tokens (user_id, token, expires_at)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const result = await pool.query(query, [userId, token, expiresAt]);
  return result.rows[0];
};

const findRefreshToken = async (token) => {
  const query = `SELECT * FROM refresh_tokens WHERE token = $1;`;
  const result = await pool.query(query, [token]);
  return result.rows[0];
};

const deleteRefreshToken = async (token) => {
  const query = `DELETE FROM refresh_tokens WHERE token = $1 RETURNING *;`;
  const result = await pool.query(query, [token]);
  return result.rows[0];
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  deleteUser,
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
};
