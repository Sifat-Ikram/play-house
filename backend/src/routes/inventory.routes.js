const express = require("express");
const inventoryController = require("../controllers/inventory.controller");

const router = express.Router();

// Specific routes MUST come before parameterized /:id routes
router.get("/featured", inventoryController.getFeaturedInventories);
router.get("/wholesale", inventoryController.getWholesaleProducts);
router.patch("/wholesale/:id", inventoryController.updateInventoryWholesale);

router.post("/", inventoryController.createInventory);
router.get("/product/:productId", inventoryController.getInventoryByProductId);
router.get("/:id", inventoryController.getInventoryById);
router.patch("/:id", inventoryController.updateInventory);
router.delete("/:id", inventoryController.deleteInventory);

module.exports = router;