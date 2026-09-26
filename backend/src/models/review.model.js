const { pool } = require("../config/db");

const createReview = async (data) => {
  const query = `
    INSERT INTO reviews (product_id, user_name, user_image_url, review_rating, review_comment)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const result = await pool.query(query, [
    data.product_id,
    data.user_name,
    data.user_image_url || null,
    data.review_rating,
    data.review_comment,
  ]);
  return result.rows[0];
};

const createReply = async (data) => {
  const query = `
    INSERT INTO review_replies (review_id, replier_name, reply_image_url, reply_comment)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const result = await pool.query(query, [
    data.review_id,
    data.replier_name,
    data.reply_image_url || null,
    data.reply_comment,
  ]);
  return result.rows[0];
};

const getReviewsByProductId = async (productId) => {
  const query = `
    SELECT
      r.review_id, r.product_id, r.user_name, r.user_image_url,
      r.review_rating, r.review_comment, r.created_at,
      COALESCE(
        json_agg(
          json_build_object(
            'reply_id', rr.reply_id,
            'review_id', rr.review_id,
            'replier_name', rr.replier_name,
            'reply_image_url', rr.reply_image_url,
            'reply_comment', rr.reply_comment,
            'created_at', rr.created_at
          ) ORDER BY rr.created_at ASC
        ) FILTER (WHERE rr.reply_id IS NOT NULL), '[]'
      ) AS replies
    FROM reviews r
    LEFT JOIN review_replies rr ON rr.review_id = r.review_id
    WHERE r.product_id = $1
    GROUP BY r.review_id
    ORDER BY r.created_at DESC;
  `;
  const result = await pool.query(query, [productId]);
  return result.rows;
};

module.exports = { createReview, createReply, getReviewsByProductId };