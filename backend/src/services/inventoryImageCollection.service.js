const axios = require("axios");
const cloudinary = require("../config/cloudinary");
const { pool } = require("../config/db");
const imageModel = require("../models/inventoryImage.model");

const MIN_IMAGES_PER_PRODUCT = 5;
const MAX_BATCH_SIZE = 5;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const normalize = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getSearchQueries = (product) => {
  const name = product.product_name;
  const category = product.category_name || "";
  const brand = product.brand_name || "";

  return [
    `${brand} ${name} ${category}`,
    `${name} ${category}`,
    `${name} product image`,
  ];
};

const searchProductImages = async (product, needed = 5) => {
  if (!process.env.SERPAPI_API_KEY) {
    throw new Error("SERPAPI_API_KEY is not configured");
  }

  const uniqueImages = new Map();

  const productWords = normalize(product.product_name)
    .split(" ")
    .filter((word) => word.length > 2);

  for (const query of getSearchQueries(product)) {
    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "google_images",
        q: query,
        api_key: process.env.SERPAPI_API_KEY,
        hl: "en",
        gl: "us",
      },
      timeout: 15000,
    });

    for (const item of response.data.images_results || []) {
      const imageUrl = item.original;

      if (
        !imageUrl ||
        !/^https?:\/\//i.test(imageUrl) ||
        !item.title ||
        uniqueImages.has(imageUrl)
      ) {
        continue;
      }

      const title = normalize(item.title);
      const matches = productWords.filter((word) => title.includes(word));

      if (productWords.length > 0 && matches.length === 0) {
        continue;
      }

      uniqueImages.set(imageUrl, {
        title: item.title,
        imageUrl,
      });

      if (uniqueImages.size >= needed) break;
    }

    if (uniqueImages.size >= needed) break;

    await delay(300);
  }

  return [...uniqueImages.values()].slice(0, needed);
};

const collectImagesForInventory = async (product) => {
  // Count images already saved for this inventory.
  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM inventory_images
     WHERE inventory_id = $1`,
    [product.inventory_id],
  );

  const existingCount = countResult.rows[0].total;
  const needed = MIN_IMAGES_PER_PRODUCT - existingCount;

  if (needed <= 0) {
    return {
      inventoryId: product.inventory_id,
      productName: product.product_name,
      existing: existingCount,
      saved: 0,
      totalImages: existingCount,
      complete: true,
      errors: [],
    };
  }

  const searchResults = await searchProductImages(product, needed);
  const savedImages = [];
  const errors = [];

  for (const [index, image] of searchResults.entries()) {
    try {
      const upload = await cloudinary.uploader.upload(image.imageUrl, {
        folder: "play-house/product-images",
        public_id: `inventory-${product.inventory_id}-${Date.now()}-${index}`,
        resource_type: "image",
        timeout: 25000,
      });

      const savedImage = await imageModel.createInventoryImage({
        inventory_id: product.inventory_id,
        image_url: upload.secure_url,
        is_display_image: existingCount === 0 && savedImages.length === 0,
      });

      savedImages.push(savedImage);
    } catch (error) {
      errors.push({
        title: image.title,
        message: error.message,
      });
    }
  }

  const totalImages = existingCount + savedImages.length;

  return {
    inventoryId: product.inventory_id,
    productName: product.product_name,
    existing: existingCount,
    found: searchResults.length,
    saved: savedImages.length,
    totalImages,
    complete: totalImages >= MIN_IMAGES_PER_PRODUCT,
    images: savedImages,
    errors,
  };
};

const collectInventoryImages = async (limit = 3) => {
  const batchSize = Number(limit);

  if (
    !Number.isInteger(batchSize) ||
    batchSize < 1 ||
    batchSize > MAX_BATCH_SIZE
  ) {
    throw new Error(`Limit must be an integer between 1 and ${MAX_BATCH_SIZE}`);
  }

  // Find every inventory that has fewer than five images.
  const result = await pool.query(
    `
    SELECT
      i.id AS inventory_id,
      i.sku,
      p.name AS product_name,
      b.brand_name,
      c.category_name,
      COUNT(ii.id)::int AS image_count
    FROM inventory i
    JOIN products p ON p.id = i.product_id
    LEFT JOIN brands b ON b.brand_id = p.brand_id
    LEFT JOIN categories c ON c.category_id = p.category_id
    LEFT JOIN inventory_images ii ON ii.inventory_id = i.id
    GROUP BY
      i.id, i.sku, p.name, b.brand_name, c.category_name, i.created_at
    HAVING COUNT(ii.id) < $1
    ORDER BY i.created_at ASC
  `,
    [MIN_IMAGES_PER_PRODUCT],
  );

  const results = [];

  // Process all eligible inventory in small sequential batches.
  for (let start = 0; start < result.rows.length; start += batchSize) {
    const batch = result.rows.slice(start, start + batchSize);

    for (const product of batch) {
      try {
        results.push(await collectImagesForInventory(product));
      } catch (error) {
        results.push({
          inventoryId: product.inventory_id,
          productName: product.product_name,
          complete: false,
          error: error.message,
        });
      }
    }
  }

  const incomplete = results.filter((item) => item.complete === false);

  return {
    totalEligible: result.rows.length,
    processed: results.length,
    completed: results.filter((item) => item.complete === true).length,
    incomplete: incomplete.length,
    databaseSaved: results.some((item) => item.saved > 0),
    results,
  };
};

module.exports = {
  collectInventoryImages,
};
