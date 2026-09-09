import { Router } from "express";

import {
    createInventoryImage,
    getInventoryImages,
    updateInventoryImage,
    deleteInventoryImage,
} from "../controllers/image.controller";

const router = Router();

// Add image
router.post("/", createInventoryImage);

// Get all images of an inventory
router.get(
    "/inventory/:inventoryId",
    getInventoryImages
);

// Update image
router.patch("/:id", updateInventoryImage);

// Delete image
router.delete("/:id", deleteInventoryImage);

export default router;