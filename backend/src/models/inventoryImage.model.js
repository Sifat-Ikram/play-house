const { pool } = require("../config/db");

const createInventoryImage = async (data) => {
    const query = `
    INSERT INTO inventory_images (
      inventory_id,
      image_url,
      is_display_image
    )
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

    const values = [
        data.inventory_id,
        data.image_url,
        data.is_display_image ?? false,
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};

const getImagesByInventoryId = async (inventoryId) => {
    const query = `
    SELECT *
    FROM inventory_images
    WHERE inventory_id = $1
    ORDER BY created_at ASC;
  `;

    const result = await pool.query(query, [inventoryId]);

    return result.rows;
};

const getInventoryImageById = async (id) => {
    const query = `
    SELECT *
    FROM inventory_images
    WHERE id = $1;
  `;

    const result = await pool.query(query, [id]);

    return result.rows[0];
};

const updateInventoryImage = async (id, data) => {
    const query = `
    UPDATE inventory_images
    SET is_display_image = $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *;
  `;

    const result = await pool.query(query, [
        data.is_display_image,
        id,
    ]);

    return result.rows[0];
};

const deleteInventoryImage = async (id) => {
    const query = `
    DELETE FROM inventory_images
    WHERE id = $1
    RETURNING *;
  `;

    const result = await pool.query(query, [id]);

    return result.rows[0];
};

module.exports = {
    createInventoryImage,
    getImagesByInventoryId,
    getInventoryImageById,
    updateInventoryImage,
    deleteInventoryImage,
};