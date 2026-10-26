const express = require("express");
const router = express.Router();
const brandController = require("../controllers/brand.controller");
const {
  requirePermission,
  requireAdmin,
} = require("../middleware/admin.middleware");

router.post(
  "/",
  requirePermission("catalog:write"),
  brandController.createBrand,
);
router.get("/", brandController.getBrands);
router.get("/:id", brandController.getBrandById);
router.put(
  "/:id",
  requirePermission("catalog:write"),
  brandController.updateBrand,
);
router.delete("/:id", requireAdmin, brandController.deleteBrand);

module.exports = router;
