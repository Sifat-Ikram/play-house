const videoService = require("../services/inventoryVideo.service");
const {
    successResponse,
} = require("../utils/response");

const createInventoryVideo = async (req, res, next) => {
    try {
        const video =
            await videoService.createInventoryVideo(req.body);

        return successResponse(
            res,
            video,
            "Inventory video created successfully",
            201
        );
    } catch (error) {
        next(error);
    }
};

const getVideosByInventoryId = async (req, res, next) => {
    try {
        const videos =
            await videoService.getVideosByInventoryId(
                req.params.inventoryId
            );

        return successResponse(
            res,
            videos,
            "Inventory videos fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};

const getInventoryVideoById = async (req, res, next) => {
    try {
        const video =
            await videoService.getInventoryVideoById(
                req.params.id
            );

        return successResponse(
            res,
            video,
            "Inventory video fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};

const updateInventoryVideo = async (req, res, next) => {
    try {
        const video =
            await videoService.updateInventoryVideo(
                req.params.id,
                req.body
            );

        return successResponse(
            res,
            video,
            "Inventory video updated successfully"
        );
    } catch (error) {
        next(error);
    }
};

const deleteInventoryVideo = async (req, res, next) => {
    try {
        const video =
            await videoService.deleteInventoryVideo(
                req.params.id
            );

        return successResponse(
            res,
            video,
            "Inventory video deleted successfully"
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createInventoryVideo,
    getVideosByInventoryId,
    getInventoryVideoById,
    updateInventoryVideo,
    deleteInventoryVideo,
};