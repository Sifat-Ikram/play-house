const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

router.post("/", productController.createProduct);

router.get("/", productController.getProducts);

router.get("/new-arrivals", productController.getNewArrivalProducts);

router.get("/featured", productController.getFeaturedProducts);

router.put("/:id", productController.updateProduct);

router.delete("/:id", productController.deleteProduct);

router.get("/name/:name", productController.getProductByName);


module.exports = router;