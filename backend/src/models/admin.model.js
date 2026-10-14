const { pool } = require("../config/db");

const toNum = (v) =>
  v === "" || v === null || v === undefined ? null : Number(v);

// ---------- Dashboard ----------
const getStats = async () => {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM products)::int AS products,
      (SELECT COUNT(*) FROM users)::int AS users,
      (SELECT COUNT(*) FROM brands)::int AS brands,
      (SELECT COUNT(*) FROM categories)::int AS categories,
      (SELECT COUNT(*) FROM inventory WHERE stock_quantity <= 5)::int AS low_stock,
      (SELECT COUNT(*) FROM products p WHERE EXISTS (
          SELECT 1 FROM inventory i WHERE i.product_id = p.id AND i.is_featured = true))::int AS featured,
      (SELECT COUNT(*) FROM orders)::int AS orders,
      (SELECT COALESCE(SUM(total), 0) FROM orders)::float AS revenue
  `);
  return result.rows[0];
};

// ---------- Users ----------
const listUsers = async () => {
  const result = await pool.query(`
    SELECT id, name, email, phone_number, role, created_at
    FROM users ORDER BY created_at DESC;
  `);
  return result.rows;
};

// ---------- Products ----------
const listProducts = async (q) => {
  const result = await pool.query(
    `
    SELECT
      p.id, p.name,
      b.brand_name, c.category_name,
      MIN(inv.selling_price) AS price,
      COALESCE(SUM(inv.stock_quantity), 0)::int AS total_stock,
      COALESCE(BOOL_OR(inv.is_featured), false) AS is_featured,
      (
        SELECT ii.image_url FROM inventory_images ii
        JOIN inventory i2 ON i2.id = ii.inventory_id
        WHERE i2.product_id = p.id
        ORDER BY ii.is_display_image DESC, ii.created_at ASC
        LIMIT 1
      ) AS image_url
    FROM products p
    LEFT JOIN brands b ON b.brand_id = p.brand_id
    LEFT JOIN categories c ON c.category_id = p.category_id
    LEFT JOIN inventory inv ON inv.product_id = p.id
    WHERE ($1::text IS NULL
        OR p.name ILIKE $1::text
        OR b.brand_name ILIKE $1::text
        OR c.category_name ILIKE $1::text)
    GROUP BY p.id, b.brand_name, c.category_name
    ORDER BY p.created_at DESC;
    `,
    [q ? `%${q}%` : null],
  );
  return result.rows;
};

const getProductById = async (id) => {
  const productResult = await pool.query(
    `
    SELECT p.*, b.brand_name, c.category_name
    FROM products p
    LEFT JOIN brands b ON b.brand_id = p.brand_id
    LEFT JOIN categories c ON c.category_id = p.category_id
    WHERE p.id = $1;
    `,
    [id],
  );

  const product = productResult.rows[0];
  if (!product) return null;

  const inventoryResult = await pool.query(
    `
    SELECT
      inv.*, col.color_name, col.hex_code AS color_hex,
      COALESCE((
        SELECT json_agg(json_build_object(
          'id', i.id, 'image_url', i.image_url, 'is_display_image', i.is_display_image
        ) ORDER BY i.created_at ASC)
        FROM inventory_images i WHERE i.inventory_id = inv.id
      ), '[]'::json) AS images
    FROM inventory inv
    LEFT JOIN colors col ON col.color_id = inv.color_id
    WHERE inv.product_id = $1
    ORDER BY inv.created_at ASC;
    `,
    [id],
  );

  return { ...product, inventory: inventoryResult.rows };
};

const setProductFeatured = async (productId, featured) => {
  if (!featured) {
    await pool.query(
      `UPDATE inventory SET is_featured = false, updated_at = CURRENT_TIMESTAMP WHERE product_id = $1;`,
      [productId],
    );
    return { featured: false };
  }

  const result = await pool.query(
    `UPDATE inventory
     SET is_featured = true, updated_at = CURRENT_TIMESTAMP
     WHERE product_id = $1 AND stock_quantity > 0 AND mark_unavailable = false
     RETURNING id;`,
    [productId],
  );

  if (result.rowCount === 0) {
    const error = new Error(
      "No in-stock inventory available to feature this product",
    );
    error.statusCode = 400;
    throw error;
  }

  return { featured: true, updated: result.rowCount };
};

// ---------- Inventory (with images, transactional) ----------
const insertImages = async (client, inventoryId, images = []) => {
  const list = images.filter((i) => i && i.image_url);
  if (list.length === 0) return;

  // ঠিক একটাই display image থাকবে: flagged টা, না থাকলে প্রথমটা
  const flaggedIndex = list.findIndex((i) => i.is_display_image);
  const displayIndex = flaggedIndex === -1 ? 0 : flaggedIndex;

  for (let idx = 0; idx < list.length; idx++) {
    await client.query(
      `INSERT INTO inventory_images (inventory_id, image_url, is_display_image) VALUES ($1, $2, $3);`,
      [inventoryId, list[idx].image_url, idx === displayIndex],
    );
  }
};

const inventoryValues = (d) => [
  toNum(d.color_id),
  d.sku || null,
  toNum(d.stock_quantity) ?? 0,
  toNum(d.buying_price) ?? 0,
  toNum(d.selling_price),
  toNum(d.min_wholesale_qty),
  toNum(d.wholesale_price),
  !!d.mark_unavailable,
  toNum(d.applicable_tax_percent),
  !!d.is_featured,
];

const createInventory = async (d) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const result = await client.query(
      `INSERT INTO inventory
        (product_id, color_id, sku, stock_quantity, buying_price, selling_price,
         min_wholesale_qty, wholesale_price, mark_unavailable, applicable_tax_percent, is_featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *;`,
      [d.product_id, ...inventoryValues(d)],
    );

    await insertImages(client, result.rows[0].id, d.images);
    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const updateInventory = async (id, d) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const result = await client.query(
      `UPDATE inventory SET
         color_id=$1, sku=$2, stock_quantity=$3, buying_price=$4, selling_price=$5,
         min_wholesale_qty=$6, wholesale_price=$7, mark_unavailable=$8,
         applicable_tax_percent=$9, is_featured=$10, updated_at=CURRENT_TIMESTAMP
       WHERE id=$11 RETURNING *;`,
      [...inventoryValues(d), id],
    );

    if (!result.rows[0]) {
      await client.query("ROLLBACK");
      return null;
    }

    // images পাঠানো হলে পুরোটা replace হবে
    if (Array.isArray(d.images)) {
      await client.query(
        `DELETE FROM inventory_images WHERE inventory_id = $1;`,
        [id],
      );
      await insertImages(client, id, d.images);
    }

    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const deleteInventory = async (id) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `DELETE FROM inventory_images WHERE inventory_id = $1;`,
      [id],
    );
    const result = await client.query(
      `DELETE FROM inventory WHERE id = $1 RETURNING *;`,
      [id],
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

module.exports = {
  getStats,
  listUsers,
  listProducts,
  getProductById,
  setProductFeatured,
  createInventory,
  updateInventory,
  deleteInventory,
};
