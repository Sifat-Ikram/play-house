const { pool } = require("../config/db");

/**
 * Builds the base SELECT + JOIN portion shared by every filter branch.
 * - INNER JOIN LATERAL for inventory: picks the first AVAILABLE inventory
 *   row (mark_unavailable = false) ordered by created_at. If a product has
 *   no available inventory at all, it is excluded automatically (INNER JOIN).
 * - LEFT JOIN LATERAL for the display image of that chosen inventory row.
 */
const BASE_SELECT = `
  SELECT
    p.id                  AS product_id,
    p.name                AS product_name,
    b.brand_name          AS brand_name,
    c.category_name       AS category_name,
    p.occasion            AS occasion,
    p.interest            AS interest,
    p.minimum_age_range   AS minimum_age_range,
    p.maximum_age_range   AS maximum_age_range,
    inv.id                AS inventory_id,
    inv.selling_price,
    img.image_url         AS display_image_url
  FROM products p
  LEFT JOIN brands b ON b.brand_id = p.brand_id
  LEFT JOIN categories c ON c.category_id = p.category_id
  INNER JOIN LATERAL (
    SELECT id, selling_price
    FROM inventory
    WHERE inventory.product_id = p.id
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
`;

const getProductListing = async (filters) => {
  const {
    brand,
    category,
    combo,
    interest,
    occasion,
    minAge,
    maxAge,
    search,
  } = filters;

  let whereClause = "";
  let values = [];

  // Priority chain — same order as the frontend's if-else chain.
  if (brand) {
    whereClause = `WHERE LOWER(b.brand_name) = LOWER($1)`;
    values = [brand];
  } else if (category) {
    whereClause = `WHERE LOWER(c.category_name) = LOWER($1)`;
    values = [category];
  } else if (combo) {
    whereClause = `
      WHERE p.id IN (
        SELECT p2.id
        FROM combo_items ci
        JOIN inventory i2 ON ci.inventory_id = i2.id
        JOIN products p2 ON i2.product_id = p2.id
        JOIN combos co ON ci.combo_id = co.id
        WHERE LOWER(co.title) = LOWER($1)
      )
    `;
    values = [combo];
  } else if (interest) {
    whereClause = `WHERE LOWER(p.interest) = LOWER($1)`;
    values = [interest];
  } else if (occasion) {
    whereClause = `WHERE LOWER(p.occasion) = LOWER($1)`;
    values = [occasion];
  } else if (minAge !== undefined && minAge !== null) {
    const min = Number(minAge);
    const max = maxAge !== undefined && maxAge !== null ? Number(maxAge) : null;

    if (max !== null) {
      // NULL range on the product is treated as "suitable for all ages".
      whereClause = `
        WHERE
          (p.minimum_age_range IS NULL OR p.minimum_age_range <= $2)
          AND
          (p.maximum_age_range IS NULL OR p.maximum_age_range >= $1)
      `;
      values = [min, max];
    } else {
      whereClause = `
        WHERE
          (p.maximum_age_range IS NULL OR p.maximum_age_range >= $1)
      `;
      values = [min];
    }
  } else if (search) {
    whereClause = `
      WHERE
        p.name ILIKE $1
        OR b.brand_name ILIKE $1
        OR c.category_name ILIKE $1
    `;
    values = [`%${search}%`];
  }

  const query = `
    ${BASE_SELECT}
    ${whereClause}
    ORDER BY p.created_at DESC;
  `;

  const result = await pool.query(query, values);
  return result.rows;
};

module.exports = {
  getProductListing,
};