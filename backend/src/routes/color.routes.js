const express = require("express");
const router = express.Router();
const colorController = require("../controllers/color.controller");
const {
  requirePermission,
  requireAdmin,
} = require("../middleware/admin.middleware");

router.post(
  "/",
  requirePermission("catalog:write"),
  colorController.createColor,
);
router.get("/", colorController.getColors);
router.get("/:id", colorController.getColorById);
router.put(
  "/:id",
  requirePermission("catalog:write"),
  colorController.updateColor,
);
router.delete("/:id", requireAdmin, colorController.deleteColor);

module.exports = router;
