const videoModel = require("../models/inventoryVideo.model");

const createInventoryVideo = async (data) => {
    if (!data.inventory_id) {
        throw new Error("Inventory ID is required");
    }

    if (!data.video_url) {
        throw new Error("Video URL is required");
    }

    return await videoModel.createInventoryVideo(data);
};

const getVideosByInventoryId = async (inventoryId) => {
    return await videoModel.getVideosByInventoryId(inventoryId);
};

const getInventoryVideoById = async (id) => {
    const video = await videoModel.getInventoryVideoById(id);

    if (!video) {
        throw new Error("Inventory video not found");
    }

    return video;
};

const updateInventoryVideo = async (id, data) => {
    const video = await videoModel.getInventoryVideoById(id);

    if (!video) {
        throw new Error("Inventory video not found");
    }

    return await videoModel.updateInventoryVideo(id, data);
};

const deleteInventoryVideo = async (id) => {
    const video = await videoModel.getInventoryVideoById(id);

    if (!video) {
        throw new Error("Inventory video not found");
    }

    return await videoModel.deleteInventoryVideo(id);
};

module.exports = {
    createInventoryVideo,
    getVideosByInventoryId,
    getInventoryVideoById,
    updateInventoryVideo,
    deleteInventoryVideo,
};