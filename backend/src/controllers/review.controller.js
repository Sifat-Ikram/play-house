const reviewService = require("../services/review.service");

const submitReview = async (req, res) => {
  try {
    const review = await reviewService.submitReview(req.body);
    return res
      .status(201)
      .json({ success: true, message: "Review submitted", data: review });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
};

const submitReply = async (req, res) => {
  try {
    const reply = await reviewService.submitReply(req.body);
    return res
      .status(201)
      .json({ success: true, message: "Reply submitted", data: reply });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
};

const getReviewsByProductId = async (req, res) => {
  try {
    const reviews = await reviewService.fetchReviewsByProductId(
      req.params.productId,
    );
    return res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { submitReview, submitReply, getReviewsByProductId };
