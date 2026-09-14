const express = require("express");

const imageController = require(
    "../controllers/inventoryImage.controller"
);

const router = express.Router();

router.post(
    "/",
    imageController.createInventoryImage
);

router.get(
    "/inventory/:inventoryId",
    imageController.getImagesByInventoryId
);

router.get(
    "/:id",
    imageController.getInventoryImageById
);

router.patch(
    "/:id",
    imageController.updateInventoryImage
);

router.delete(
    "/:id",
    imageController.deleteInventoryImage
);

module.exports = router;