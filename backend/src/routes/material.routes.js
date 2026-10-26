const express = require("express");
const router = express.Router();
const controller = require("../controllers/material.controller");
const {
  requirePermission,
  requireAdmin,
} = require("../middleware/admin.middleware");

router.get("/", requirePermission("read"), controller.getMaterials);
router.post("/", requirePermission("catalog:write"), controller.createMaterial);
router.put(
  "/:id",
  requirePermission("catalog:write"),
  controller.updateMaterial,
);
router.delete("/:id", requireAdmin, controller.deleteMaterial);

module.exports = router;
