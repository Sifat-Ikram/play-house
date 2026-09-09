import { Router } from "express";

import {
    createInventory,
    getInventoryById,
    getInventoriesByProduct,
    updateInventory,
    deleteInventory,
} from "../controllers/inventory.controller";

const router = Router();

// Create inventory
router.post("/", createInventory);

// Get all inventories of a product
router.get(
    "/product/:productId",
    getInventoriesByProduct
);

// Get single inventory
router.get("/:id", getInventoryById);

// Update inventory
router.patch("/:id", updateInventory);

// Delete inventory
router.delete("/:id", deleteInventory);

export default router;