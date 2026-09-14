const { pool } = require("../config/db");

const createInventoryVideo = async (data) => {
    const query = `
    INSERT INTO inventory_videos (
      inventory_id,
      video_url
    )
    VALUES ($1, $2)
    RETURNING *;
  `;

    const result = await pool.query(query, [
        data.inventory_id,
        data.video_url,
    ]);

    return result.rows[0];
};

const getVideosByInventoryId = async (inventoryId) => {
    const query = `
    SELECT *
    FROM inventory_videos
    WHERE inventory_id = $1
    ORDER BY created_at ASC;
  `;

    const result = await pool.query(query, [inventoryId]);

    return result.rows;
};

const getInventoryVideoById = async (id) => {
    const query = `
    SELECT *
    FROM inventory_videos
    WHERE id = $1;
  `;

    const result = await pool.query(query, [id]);

    return result.rows[0];
};

const updateInventoryVideo = async (id, data) => {
    const query = `
    UPDATE inventory_videos
    SET video_url = $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *;
  `;

    const result = await pool.query(query, [
        data.video_url,
        id,
    ]);

    return result.rows[0];
};

const deleteInventoryVideo = async (id) => {
    const query = `
    DELETE FROM inventory_videos
    WHERE id = $1
    RETURNING *;
  `;

    const result = await pool.query(query, [id]);

    return result.rows[0];
};

module.exports = {
    createInventoryVideo,
    getVideosByInventoryId,
    getInventoryVideoById,
    updateInventoryVideo,
    deleteInventoryVideo,
};