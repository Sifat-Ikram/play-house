const inventoryService = require("../services/inventory.service");
const {
    successResponse,
} = require("../utils/response");

const createInventory = async (req, res, next) => {
    try {
        const inventory =
            await inventoryService.createInventory(req.body);

        return successResponse(
            res,
            inventory,
            "Inventory created successfully",
            201
        );
    } catch (error) {
        next(error);
    }
};

const getInventoryById = async (req, res, next) => {
    try {
        const inventory =
            await inventoryService.getInventoryById(req.params.id);

        return successResponse(
            res,
            inventory,
            "Inventory fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};

const getInventoryByProductId = async (req, res, next) => {
    try {
        const inventory =
            await inventoryService.getInventoryByProductId(
                req.params.productId
            );

        return successResponse(
            res,
            inventory,
            "Inventory fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};

const updateInventory = async (req, res, next) => {
    try {
        const inventory =
            await inventoryService.updateInventory(
                req.params.id,
                req.body
            );

        return successResponse(
            res,
            inventory,
            "Inventory updated successfully"
        );
    } catch (error) {
        next(error);
    }
};

const deleteInventory = async (req, res, next) => {
    try {
        const inventory =
            await inventoryService.deleteInventory(req.params.id);

        return successResponse(
            res,
            inventory,
            "Inventory deleted successfully"
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createInventory,
    getInventoryById,
    getInventoryByProductId,
    updateInventory,
    deleteInventory,
};