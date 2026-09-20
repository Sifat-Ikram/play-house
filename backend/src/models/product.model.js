const { pool } = require("../config/db");

const createProduct = async (data) => {
  const query = `
    INSERT INTO products (
      category_id,
      brand_id,
      name,
      number_of_pieces,
      warranty_info,
      minimum_age_range,
      maximum_age_range,
      description,
      in_the_box,
      summary,
      return_and_refund_policy,
      materials
    )
    VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10, $11, $12
    )
    RETURNING *;
  `;

  const values = [
    data.category_id,
    data.brand_id,
    data.name,
    data.number_of_pieces ?? null,
    data.warranty_info ?? null,
    data.minimum_age_range ?? null,
    data.maximum_age_range ?? null,
    data.description ?? null,
    data.in_the_box ?? null,
    data.summary ?? null,
    data.return_and_refund_policy ?? null,
    data.materials ?? [], // Expecting an array e.g. ["Plastic", "Wood"]
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const getProductById = async (id) => {
  const query = `
    SELECT *
    FROM products
    WHERE id = $1;
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const getProducts = async () => {
  const query = `
    SELECT *
    FROM products
    ORDER BY created_at DESC;
  `;

  const result = await pool.query(query);
  return result.rows;
};

const updateProduct = async (id, data) => {
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
    UPDATE products
    SET ${fields.join(", ")},
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $${index}
    RETURNING *;
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteProduct = async (id) => {
  const query = `
    DELETE FROM products
    WHERE id = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const getNewArrivalProducts = async () => {
  const query = `
    SELECT
      p.*,
      b.brand_name AS brand_name,
      c.category_name AS category_name,
      inv.id AS inventory_id,
      inv.selling_price,
      inv.stock_quantity,
      inv.sku,
      img.image_url AS display_image_url
    FROM products p
    LEFT JOIN brands b ON b.brand_id = p.brand_id
    LEFT JOIN categories c ON c.category_id = p.category_id
    LEFT JOIN LATERAL (
      SELECT id, selling_price, stock_quantity, sku
      FROM inventory
      WHERE inventory.product_id = p.id
      ORDER BY created_at ASC
      LIMIT 1
    ) inv ON true
    LEFT JOIN LATERAL (
      SELECT image_url
      FROM inventory_images
      WHERE inventory_images.inventory_id = inv.id
        AND inventory_images.is_display_image = true
      ORDER BY created_at ASC
      LIMIT 1
    ) img ON true
    WHERE p.created_at >= NOW() - INTERVAL '4 months'
    ORDER BY p.created_at DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
};

const getFeaturedProducts = async () => {
  const query = `
    SELECT
      p.*,
      b.brand_name AS brand_name,
      c.category_name AS category_name,
      inv.id AS inventory_id,
      inv.selling_price,
      inv.stock_quantity,
      inv.sku,
      inv.is_featured,
      img.image_url AS display_image_url
    FROM products p
    LEFT JOIN brands b ON b.brand_id = p.brand_id
    LEFT JOIN categories c ON c.category_id = p.category_id
    INNER JOIN LATERAL (
      SELECT id, selling_price, stock_quantity, sku, is_featured
      FROM inventory
      WHERE inventory.product_id = p.id
        AND inventory.is_featured = true
        AND inventory.mark_unavailable = false
      ORDER BY created_at ASC
      LIMIT 1
    ) inv ON true
    LEFT JOIN LATERAL (
      SELECT image_url
      FROM inventory_images
      WHERE inventory_images.inventory_id = inv.id
        AND inventory_images.is_display_image = true
      ORDER BY created_at ASC
      LIMIT 1
    ) img ON true
    ORDER BY p.created_at DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
};

const getProductByName = async (name) => {
  const query = `
    SELECT 
      p.*,
      b.brand_name,
      c.category_name,
      COALESCE(
        json_agg(
          json_build_object(
            'id', inv.id,
            'color_id', inv.color_id,
            'sku', inv.sku,
            'stock_quantity', inv.stock_quantity,
            'buying_price', inv.buying_price,
            'selling_price', inv.selling_price,
            'min_wholesale_qty', inv.min_wholesale_qty,
            'wholesale_price', inv.wholesale_price,
            'mark_unavailable', inv.mark_unavailable,
            'applicable_tax_percent', inv.applicable_tax_percent,
            'is_featured', inv.is_featured,
            'created_at', inv.created_at,
            'updated_at', inv.updated_at,
            'images', COALESCE(img.images, '[]'::json)
          )
        ) FILTER (WHERE inv.id IS NOT NULL), '[]'::json
      ) AS inventory
    FROM products p
    LEFT JOIN brands b ON b.brand_id = p.brand_id
    LEFT JOIN categories c ON c.category_id = p.category_id
    LEFT JOIN inventory inv ON inv.product_id = p.id
    LEFT JOIN LATERAL (
      SELECT json_agg(
        json_build_object(
          'id', i.id,
          'image_url', i.image_url,
          'is_display_image', i.is_display_image,
          'created_at', i.created_at,
          'updated_at', i.updated_at
        ) ORDER BY i.created_at ASC
      ) AS images
      FROM inventory_images i
      WHERE i.inventory_id = inv.id
    ) img ON true
    WHERE LOWER(p.name) = LOWER($1)
    GROUP BY p.id, b.brand_name, c.category_name;
  `;

  const result = await pool.query(query, [name]);
  return result.rows[0];
};

module.exports = {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
  deleteProduct,
  getNewArrivalProducts,
  getFeaturedProducts,
  getProductByName,
};