const express = require("express");

const videoController = require(
    "../controllers/inventoryVideo.controller"
);

const router = express.Router();

router.post(
    "/",
    videoController.createInventoryVideo
);

router.get(
    "/inventory/:inventoryId",
    videoController.getVideosByInventoryId
);

router.get(
    "/:id",
    videoController.getInventoryVideoById
);

router.patch(
    "/:id",
    videoController.updateInventoryVideo
);

router.delete(
    "/:id",
    videoController.deleteInventoryVideo
);

module.exports = router;