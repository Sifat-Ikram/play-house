const reviewModel = require("../models/review.model");

const submitReview = async (data) => {
  if (
    !data.product_id ||
    !data.user_name ||
    !data.review_rating ||
    !data.review_comment
  ) {
    const error = new Error(
      "product_id, user_name, review_rating, and review_comment are required",
    );
    error.statusCode = 400;
    throw error;
  }

  if (data.review_rating < 1 || data.review_rating > 5) {
    const error = new Error("review_rating must be between 1 and 5");
    error.statusCode = 400;
    throw error;
  }

  return await reviewModel.createReview(data);
};

const submitReply = async (data) => {
  if (!data.review_id || !data.replier_name || !data.reply_comment) {
    const error = new Error(
      "review_id, replier_name, and reply_comment are required",
    );
    error.statusCode = 400;
    throw error;
  }

  return await reviewModel.createReply(data);
};

const fetchReviewsByProductId = async (productId) => {
  return await reviewModel.getReviewsByProductId(productId);
};

module.exports = { submitReview, submitReply, fetchReviewsByProductId };
