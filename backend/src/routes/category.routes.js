const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const {
  requirePermission,
  requireAdmin,
} = require("../middleware/admin.middleware");

router.post(
  "/",
  requirePermission("catalog:write"),
  categoryController.createCategory,
);
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);
router.put(
  "/:id",
  requirePermission("catalog:write"),
  categoryController.updateCategory,
);
router.delete("/:id", requireAdmin, categoryController.deleteCategory);

module.exports = router;
