const reviewService = require("../services/reviewService");

const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await reviewService.fetchReviewsByProductId(productId);
        return res.status(200).json({ success: true, data: reviews });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

const createReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const review = await reviewService.addReview(productId, req.body);
        return res.status(201).json({ success: true, data: review });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

const updateReview = async (req, res) => {
    try {
        const { productId, reviewId } = req.params;
        const updatedReview = await reviewService.editReview(productId, reviewId, req.body);
        return res.status(200).json({ success: true, data: updatedReview });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

const deleteReview = async (req, res) => {
    try {
        const { productId, reviewId } = req.params;
        await reviewService.removeReview(productId, reviewId);
        return res.status(200).json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

const createReply = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const reply = await reviewService.addReply(reviewId, req.body);
        return res.status(201).json({ success: true, data: reply });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

const updateReply = async (req, res) => {
    try {
        const { replyId } = req.params;
        const updatedReply = await reviewService.editReply(replyId, req.body);
        return res.status(200).json({ success: true, data: updatedReply });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

const deleteReply = async (req, res) => {
    try {
        const { replyId } = req.params;
        await reviewService.removeReply(replyId);
        return res.status(200).json({ success: true, message: "Reply deleted successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
};

const getTopRatedReviews = async (req, res) => {
    try {
        const reviews = await reviewService.fetchTopRatedReviews();
        return res.status(200).json({
            success: true,
            data: reviews,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};

module.exports = {
    getProductReviews,
    createReview,
    updateReview,
    deleteReview,
    createReply,
    updateReply,
    deleteReply,
    getTopRatedReviews
};