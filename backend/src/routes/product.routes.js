const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const {
  requirePermission,
  requireAdmin,
} = require("../middleware/admin.middleware");

router.post(
  "/",
  requirePermission("catalog:write"),
  productController.createProduct,
);

router.get("/", productController.getProducts);

router.get("/new-arrivals", productController.getNewArrivalProducts);

router.get("/featured", productController.getFeaturedProducts);

router.put(
  "/:id",
  requirePermission("catalog:write"),
  productController.updateProduct,
);

router.delete("/:id", requireAdmin, productController.deleteProduct);

router.get("/name/:name", productController.getProductByName);

router.get("/suggest", productController.getSearchSuggestions);

module.exports = router;
