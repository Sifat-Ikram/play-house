const axios = require("axios");
const cloudinary = require("cloudinary").v2;
const { pool } = require("../config/db");
const imageModel = require("../models/inventoryImage.model");

const MAX_IMAGES_PER_PRODUCT = 5;

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

  return [`${name} ${category}`, name, `${name} product image`];
};

const searchProductImages = async (product) => {
  const uniqueImages = new Map();

  for (const query of getSearchQueries(product)) {
    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "google_images",
        q: query,
        api_key: process.env.SERPAPI_API_KEY,
        hl: "en",
        gl: "us",
      },
      timeout: 20000,
    });

    for (const item of response.data.images_results || []) {
      const imageUrl = item.original || item.thumbnail;

      if (!imageUrl || !/^https?:\/\//i.test(imageUrl) || !item.title) {
        continue;
      }

      // Avoid obviously unrelated results using product-name words.
      // Brand matching is intentionally not enforced.
      const productWords = normalize(product.product_name)
        .split(" ")
        .filter((word) => word.length > 2);

      const title = normalize(item.title);
      const matchingWords = productWords.filter((word) => title.includes(word));

      if (productWords.length > 0 && matchingWords.length === 0) {
        continue;
      }

      if (!uniqueImages.has(imageUrl)) {
        uniqueImages.set(imageUrl, {
          title: item.title,
          imageUrl,
        });
      }
    }

    if (uniqueImages.size >= MAX_IMAGES_PER_PRODUCT) break;

    await delay(300);
  }

  return [...uniqueImages.values()].slice(0, MAX_IMAGES_PER_PRODUCT);
};

const collectImagesForInventory = async (product) => {
  const searchResults = await searchProductImages(product);
  const savedImages = [];
  const errors = [];

  for (const [index, image] of searchResults.entries()) {
    try {
      const upload = await cloudinary.uploader.upload(image.imageUrl, {
        folder: "play-house/product-images",
        public_id: `inventory-${product.inventory_id}-${Date.now()}-${index}`,
        resource_type: "image",
        timeout: 30000,
      });

      // Save through the existing model method.
      const savedImage = await imageModel.createInventoryImage({
        inventory_id: product.inventory_id,
        image_url: upload.secure_url,
        is_display_image: index === 0 && savedImages.length === 0,
      });

      savedImages.push(savedImage);
    } catch (error) {
      errors.push({
        title: image.title,
        message: error.message,
      });
    }
  }

  return {
    inventoryId: product.inventory_id,
    productName: product.product_name,
    found: searchResults.length,
    saved: savedImages.length,
    images: savedImages,
    errors,
  };
};

const collectInventoryImages = async (limit = 3) => {
  const batchLimit = Number(limit);

  if (!Number.isInteger(batchLimit) || batchLimit < 1 || batchLimit > 5) {
    throw new Error("Limit must be an integer between 1 and 5");
  }

  // Only select inventory items that do not have saved images.
  const result = await pool.query(
    `
      SELECT
        i.id AS inventory_id,
        i.sku,
        p.name AS product_name,
        b.name AS brand_name,
        c.name AS category_name
      FROM inventory i
      JOIN products p ON p.id = i.product_id
      LEFT JOIN brands b ON b.id = p.brand_id
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE NOT EXISTS (
        SELECT 1
        FROM inventory_images ii
        WHERE ii.inventory_id = i.id
      )
      ORDER BY i.created_at ASC
      LIMIT $1
    `,
    [batchLimit],
  );

  const results = [];

  for (const product of result.rows) {
    try {
      results.push(await collectImagesForInventory(product));
    } catch (error) {
      results.push({
        inventoryId: product.inventory_id,
        productName: product.product_name,
        error: error.message,
      });
    }
  }

  return {
    processed: results.length,
    databaseSaved: results.some((item) => item.saved > 0),
    results,
  };
};

module.exports = {
  collectInventoryImages,
};
