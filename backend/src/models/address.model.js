const { pool } = require("../config/db");

const MAX_ADDRESSES = 5;

const bad = (message, statusCode = 400) => {
  const e = new Error(message);
  e.statusCode = statusCode;
  return e;
};

const list = async (userId) => {
  const r = await pool.query(
    `SELECT * FROM user_addresses WHERE user_id = $1 ORDER BY is_default DESC, id DESC;`,
    [userId],
  );
  return r.rows;
};

const create = async (userId, d) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const count = Number(
      (
        await client.query(
          `SELECT COUNT(*) FROM user_addresses WHERE user_id = $1;`,
          [userId],
        )
      ).rows[0].count,
    );
    if (count >= MAX_ADDRESSES)
      throw bad(`You can save up to ${MAX_ADDRESSES} addresses`);

    const makeDefault = count === 0 || d.is_default;
    if (makeDefault) {
      await client.query(
        `UPDATE user_addresses SET is_default = false WHERE user_id = $1;`,
        [userId],
      );
    }

    const r = await client.query(
      `INSERT INTO user_addresses (user_id, label, name, phone, city, address, is_default)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *;`,
      [userId, d.label, d.name, d.phone, d.city, d.address, makeDefault],
    );

    await client.query("COMMIT");
    return r.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const update = async (userId, id, d) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    if (d.is_default) {
      await client.query(
        `UPDATE user_addresses SET is_default = false WHERE user_id = $1;`,
        [userId],
      );
    }

    const r = await client.query(
      `UPDATE user_addresses SET label=$1, name=$2, phone=$3, city=$4, address=$5,
         is_default = (is_default OR $6)
       WHERE id = $7 AND user_id = $8 RETURNING *;`,
      [d.label, d.name, d.phone, d.city, d.address, !!d.is_default, id, userId],
    );

    await client.query("COMMIT");
    return r.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const setDefault = async (userId, id) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `UPDATE user_addresses SET is_default = false WHERE user_id = $1;`,
      [userId],
    );
    const r = await client.query(
      `UPDATE user_addresses SET is_default = true WHERE id = $1 AND user_id = $2 RETURNING *;`,
      [id, userId],
    );
    if (!r.rows[0]) throw bad("Address not found", 404);
    await client.query("COMMIT");
    return r.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const remove = async (userId, id) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const r = await client.query(
      `DELETE FROM user_addresses WHERE id = $1 AND user_id = $2 RETURNING *;`,
      [id, userId],
    );
    const deleted = r.rows[0];
    if (!deleted) throw bad("Address not found", 404);

    if (deleted.is_default) {
      await client.query(
        `UPDATE user_addresses SET is_default = true
         WHERE id = (SELECT id FROM user_addresses WHERE user_id = $1 ORDER BY id DESC LIMIT 1);`,
        [userId],
      );
    }

    await client.query("COMMIT");
    return deleted;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { list, create, update, setDefault, remove };
