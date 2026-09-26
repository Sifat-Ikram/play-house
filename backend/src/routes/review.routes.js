const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");

router.post("/", reviewController.submitReview);
router.post("/reply", reviewController.submitReply);
router.get("/product/:productId", reviewController.getReviewsByProductId);

module.exports = router;
