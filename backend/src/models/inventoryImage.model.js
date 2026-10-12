const { pool } = require("../config/db");

const createInventoryImage = async (data) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let isDisplayImage = data.is_display_image ?? false;

    // If this is the first image for this inventory,
    // make it the display image automatically.
    if (isDisplayImage) {
      await client.query(
        `UPDATE inventory_images
         SET is_display_image = false,
             updated_at = CURRENT_TIMESTAMP
         WHERE inventory_id = $1`,
        [data.inventory_id],
      );
    }

    const query = `
      INSERT INTO inventory_images (
        inventory_id,
        image_url,
        is_display_image
      )
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const result = await client.query(query, [
      data.inventory_id,
      data.image_url,
      isDisplayImage,
    ]);

    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const getImagesByInventoryId = async (inventoryId) => {
  const result = await pool.query(
    `SELECT * FROM inventory_images
     WHERE inventory_id = $1
     ORDER BY created_at ASC`,
    [inventoryId],
  );

  return result.rows;
};

const getInventoryImageById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM inventory_images WHERE id = $1`,
    [id],
  );

  return result.rows[0];
};

const updateInventoryImage = async (id, data) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const current = await client.query(
      `SELECT inventory_id FROM inventory_images WHERE id = $1`,
      [id],
    );

    if (!current.rows[0]) {
      throw new Error("Inventory image not found");
    }

    if (data.is_display_image === true) {
      await client.query(
        `UPDATE inventory_images
         SET is_display_image = false,
             updated_at = CURRENT_TIMESTAMP
         WHERE inventory_id = $1`,
        [current.rows[0].inventory_id],
      );
    }

    const result = await client.query(
      `UPDATE inventory_images
       SET is_display_image = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [data.is_display_image, id],
    );

    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const deleteInventoryImage = async (id) => {
  const result = await pool.query(
    `DELETE FROM inventory_images
     WHERE id = $1
     RETURNING *`,
    [id],
  );

  return result.rows[0];
};

module.exports = {
  createInventoryImage,
  getImagesByInventoryId,
  getInventoryImageById,
  updateInventoryImage,
  deleteInventoryImage,
};
