const imageModel = require("../models/inventoryImage.model");

const createInventoryImage = async (data) => {
    if (!data.inventory_id) {
        throw new Error("Inventory ID is required");
    }

    if (!data.image_url) {
        throw new Error("Image URL is required");
    }

    return await imageModel.createInventoryImage(data);
};

const getImagesByInventoryId = async (inventoryId) => {
    return await imageModel.getImagesByInventoryId(inventoryId);
};

const getInventoryImageById = async (id) => {
    const image = await imageModel.getInventoryImageById(id);

    if (!image) {
        throw new Error("Inventory image not found");
    }

    return image;
};

const updateInventoryImage = async (id, data) => {
    const image = await imageModel.getInventoryImageById(id);

    if (!image) {
        throw new Error("Inventory image not found");
    }

    return await imageModel.updateInventoryImage(id, data);
};

const deleteInventoryImage = async (id) => {
    const image = await imageModel.getInventoryImageById(id);

    if (!image) {
        throw new Error("Inventory image not found");
    }

    return await imageModel.deleteInventoryImage(id);
};

module.exports = {
    createInventoryImage,
    getImagesByInventoryId,
    getInventoryImageById,
    updateInventoryImage,
    deleteInventoryImage,
};