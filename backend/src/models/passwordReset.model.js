const { pool } = require("../config/db");

const createReset = async (userId, tokenHash, expiresAt) => {
  await pool.query(
    `DELETE FROM password_resets WHERE user_id = $1 AND used = false;`,
    [userId],
  );
  await pool.query(
    `INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES ($1, $2, $3);`,
    [userId, tokenHash, expiresAt],
  );
};

const findValid = async (tokenHash) => {
  const result = await pool.query(
    `SELECT * FROM password_resets WHERE token_hash = $1 AND used = false AND expires_at > NOW();`,
    [tokenHash],
  );
  return result.rows[0];
};

const consumeAndSetPassword = async (resetId, userId, passwordHash) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2;`,
      [passwordHash, userId],
    );
    await client.query(
      `UPDATE password_resets SET used = true WHERE id = $1;`,
      [resetId],
    );
    await client.query(`DELETE FROM refresh_tokens WHERE user_id = $1;`, [
      userId,
    ]);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { createReset, findValid, consumeAndSetPassword };
