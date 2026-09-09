import { Router } from "express";

import {
    createInventoryVideo,
    getInventoryVideos,
    updateInventoryVideo,
    deleteInventoryVideo,
} from "../controllers/video.controller";

const router = Router();

// Add video
router.post("/", createInventoryVideo);

// Get all videos of an inventory
router.get(
    "/inventory/:inventoryId",
    getInventoryVideos
);

// Update video
router.patch("/:id", updateInventoryVideo);

// Delete video
router.delete("/:id", deleteInventoryVideo);

export default router;