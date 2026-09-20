const { pool } = require("../config/db");

// --- REVIEWS ---

const getReviewsByProductId = async (productId) => {
    const query = `
    SELECT 
      r.review_id,
      r.product_id,
      r.user_name,
      r.user_image_url,
      r.review_rating,
      r.review_comment,
      r.created_at,
      COALESCE(
        json_agg(
          json_build_object(
            'reply_id', rep.reply_id,
            'review_id', rep.review_id,
            'replier_name', rep.replier_name,
            'reply_image_url', rep.reply_image_url,
            'reply_comment', rep.reply_comment,
            'created_at', rep.created_at
          ) ORDER BY rep.created_at ASC
        ) FILTER (WHERE rep.reply_id IS NOT NULL), '[]'::json
      ) AS replies
    FROM reviews r
    LEFT JOIN review_replies rep ON rep.review_id = r.review_id
    WHERE r.product_id = $1
    GROUP BY r.review_id
    ORDER BY r.created_at DESC;
  `;
    const result = await pool.query(query, [productId]);
    return result.rows;
};

const createReview = async (productId, data) => {
    const query = `
    INSERT INTO reviews (product_id, user_name, user_image_url, review_rating, review_comment)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
    const values = [
        productId,
        data.user_name,
        data.user_image_url ?? null,
        data.review_rating,
        data.review_comment,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const updateReview = async (productId, reviewId, data) => {
    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(data)) {
        fields.push(`${key} = $${index}`);
        values.push(value);
        index++;
    }

    values.push(productId, reviewId);

    const query = `
    UPDATE reviews
    SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
    WHERE product_id = $${index} AND review_id = $${index + 1}
    RETURNING *;
  `;
    const result = await pool.query(query, values);
    return result.rows[0];
};

const deleteReview = async (productId, reviewId) => {
    const query = `
    DELETE FROM reviews
    WHERE product_id = $1 AND review_id = $2
    RETURNING *;
  `;
    const result = await pool.query(query, [productId, reviewId]);
    return result.rows[0];
};

// --- REPLIES ---

const createReply = async (reviewId, data) => {
    const query = `
    INSERT INTO review_replies (review_id, replier_name, reply_image_url, reply_comment)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
    const values = [
        reviewId,
        data.replier_name,
        data.reply_image_url ?? null,
        data.reply_comment,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const updateReply = async (replyId, data) => {
    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(data)) {
        fields.push(`${key} = $${index}`);
        values.push(value);
        index++;
    }

    values.push(replyId);

    const query = `
    UPDATE review_replies
    SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
    WHERE reply_id = $${index}
    RETURNING *;
  `;
    const result = await pool.query(query, values);
    return result.rows[0];
};

const deleteReply = async (replyId) => {
    const query = `
    DELETE FROM review_replies
    WHERE reply_id = $1
    RETURNING *;
  `;
    const result = await pool.query(query, [replyId]);
    return result.rows[0];
};

const getTopRatedReviews = async () => {
    const query = `
    SELECT 
      r.review_id,
      r.user_name,
      r.user_image_url,
      p.name AS product_name,
      r.review_rating,
      r.review_comment,
      r.created_at
    FROM reviews r
    JOIN products p ON p.id = r.product_id
    ORDER BY r.review_rating DESC, r.created_at DESC
    LIMIT 10;
  `;

    const result = await pool.query(query);
    return result.rows;
};

module.exports = {
    getReviewsByProductId,
    createReview,
    updateReview,
    deleteReview,
    createReply,
    updateReply,
    deleteReply,
    getTopRatedReviews
};