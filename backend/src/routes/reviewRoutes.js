const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

// Review routes bound to product_id
router.get("/products/:productId/reviews", reviewController.getProductReviews);
router.post("/products/:productId/reviews", reviewController.createReview);
router.put("/products/:productId/reviews/:reviewId", reviewController.updateReview);
router.delete("/products/:productId/reviews/:reviewId", reviewController.deleteReview);
router.get("/top-rated", reviewController.getTopRatedReviews);

// Reply routes
router.post("/reviews/:reviewId/replies", reviewController.createReply);
router.put("/replies/:replyId", reviewController.updateReply);
router.delete("/replies/:replyId", reviewController.deleteReply);

module.exports = router;