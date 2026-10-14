const express = require("express");
const router = express.Router();
const controller = require("../controllers/material.controller");
const { requireAdmin } = require("../middleware/admin.middleware");

router.get("/", requireAdmin, controller.getMaterials);
router.post("/", requireAdmin, controller.createMaterial);
router.put("/:id", requireAdmin, controller.updateMaterial);
router.delete("/:id", requireAdmin, controller.deleteMaterial);

module.exports = router;
