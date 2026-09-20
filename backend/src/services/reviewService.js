const reviewModel = require("../models/reviewModel");

const fetchReviewsByProductId = async (productId) => {
    return await reviewModel.getReviewsByProductId(productId);
};

const addReview = async (productId, data) => {
    if (!data.user_name || !data.review_rating || !data.review_comment) {
        throw new Error("user_name, review_rating, and review_comment are required");
    }
    return await reviewModel.createReview(productId, data);
};

const editReview = async (productId, reviewId, data) => {
    const updated = await reviewModel.updateReview(productId, reviewId, data);
    if (!updated) {
        const error = new Error("Review not found for this product");
        error.statusCode = 404;
        throw error;
    }
    return updated;
};

const removeReview = async (productId, reviewId) => {
    const deleted = await reviewModel.deleteReview(productId, reviewId);
    if (!deleted) {
        const error = new Error("Review not found for this product");
        error.statusCode = 404;
        throw error;
    }
    return deleted;
};

const addReply = async (reviewId, data) => {
    if (!data.replier_name || !data.reply_comment) {
        throw new Error("replier_name and reply_comment are required");
    }
    return await reviewModel.createReply(reviewId, data);
};

const editReply = async (replyId, data) => {
    const updated = await reviewModel.updateReply(replyId, data);
    if (!updated) {
        const error = new Error("Reply not found");
        error.statusCode = 404;
        throw error;
    }
    return updated;
};

const removeReply = async (replyId) => {
    const deleted = await reviewModel.deleteReply(replyId);
    if (!deleted) {
        const error = new Error("Reply not found");
        error.statusCode = 404;
        throw error;
    }
    return deleted;
};

const fetchTopRatedReviews = async () => {
    return await reviewModel.getTopRatedReviews();
};

module.exports = {
    fetchReviewsByProductId,
    addReview,
    editReview,
    removeReview,
    addReply,
    editReply,
    removeReply,
    fetchTopRatedReviews
};