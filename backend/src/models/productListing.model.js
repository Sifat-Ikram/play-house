const { pool } = require("../config/db");

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
    inv.min_wholesale_qty,
    inv.wholesale_price,

    img.image_url         AS display_image_url

  FROM products p

  LEFT JOIN brands b
    ON b.brand_id = p.brand_id

  LEFT JOIN categories c
    ON c.category_id = p.category_id

  INNER JOIN LATERAL (
    SELECT
      i.id,
      i.selling_price,
      i.min_wholesale_qty,
      i.wholesale_price

    FROM inventory i

    WHERE i.product_id = p.id
      AND i.mark_unavailable = false

    ORDER BY i.created_at ASC
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
    wholesale,
  } = filters;

  let whereClause = "";
  let values = [];

  /*
    --------------------------------------------------
    PRIMARY FILTERS
    --------------------------------------------------

    Only ONE primary filter is used at a time.

    Priority:
    brand
    category
    combo
    interest
    occasion
    age
    search
    wholesale
  */

  if (brand) {
    whereClause = `
      WHERE LOWER(b.brand_name) = LOWER($1)
    `;

    values = [brand];
  } else if (category) {
    whereClause = `
      WHERE LOWER(c.category_name) = LOWER($1)
    `;

    values = [category];
  } else if (combo) {
    whereClause = `
      WHERE p.id IN (
        SELECT p2.id
        FROM combo_items ci

        JOIN inventory i2
          ON ci.inventory_id = i2.id

        JOIN products p2
          ON i2.product_id = p2.id

        JOIN combos co
          ON ci.combo_id = co.id

        WHERE LOWER(co.title) = LOWER($1)
      )
    `;

    values = [combo];
  } else if (interest) {
    whereClause = `
      WHERE LOWER(p.interest) = LOWER($1)
    `;

    values = [interest];
  } else if (occasion) {
    whereClause = `
      WHERE LOWER(p.occasion) = LOWER($1)
    `;

    values = [occasion];
  } else if (minAge !== undefined && minAge !== null) {
    const min = Number(minAge);

    const max = maxAge !== undefined && maxAge !== null ? Number(maxAge) : null;

    if (max !== null) {
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
          p.maximum_age_range IS NULL
          OR p.maximum_age_range >= $1
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
  } else if (wholesale === "true") {

  /*
    --------------------------------------------------
    WHOLESALE FILTER
    --------------------------------------------------

    Wholesale is completely independent.

    A product is wholesale ONLY when an available
    inventory row has:

    1. min_wholesale_qty
    2. wholesale_price
    3. wholesale_price < selling_price

    Wholesale does NOT depend on:
    - brand
    - category
    - search
    - interest
    - occasion
    - age
  */
    whereClause = `
      WHERE EXISTS (
        SELECT 1
        FROM inventory wi

        WHERE wi.product_id = p.id
          AND wi.mark_unavailable = false
          AND wi.min_wholesale_qty IS NOT NULL
          AND wi.wholesale_price IS NOT NULL
          AND wi.wholesale_price < wi.selling_price
      )
    `;

    values = [];
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
