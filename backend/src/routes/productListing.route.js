const express = require("express");
const router = express.Router();
const productListingController = require("../controllers/productListing.controller");

router.get("/", productListingController.getProductListing);

module.exports = router;