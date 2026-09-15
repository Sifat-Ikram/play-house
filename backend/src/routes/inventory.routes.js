const express = require("express");

const inventoryController = require("../controllers/inventory.controller");

const router = express.Router();

router.post("/", inventoryController.createInventory);

router.get("/:id", inventoryController.getInventoryById);

router.get(
    "/product/:productId",
    inventoryController.getInventoryByProductId
);

router.patch("/:id", inventoryController.updateInventory);

router.delete("/:id", inventoryController.deleteInventory);

router.get("/featured", inventoryController.getFeaturedInventories);

module.exports = router;