const express = require("express");
const router = express.Router();

const imageController = require("../controllers/inventoryImage.controller");

// Automatically search, upload and save images.
router.post("/collect", imageController.collectInventoryImages);

// Existing CRUD routes — keep these.
router.post("/", imageController.createInventoryImage);
router.get("/inventory/:inventoryId", imageController.getImagesByInventoryId);
router.get("/:id", imageController.getInventoryImageById);
router.patch("/:id", imageController.updateInventoryImage);
router.delete("/:id", imageController.deleteInventoryImage);

module.exports = router;
