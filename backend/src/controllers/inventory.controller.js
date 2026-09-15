const inventoryService = require("../services/inventory.service");
const { successResponse } = require("../utils/response");

const createInventory = async (req, res, next) => {
    try {
        const inventory = await inventoryService.createInventory(req.body);
        return successResponse(res, inventory, "Inventory created successfully", 201);
    } catch (error) {
        next(error);
    }
};

const getInventoryById = async (req, res, next) => {
    try {
        const inventory = await inventoryService.getInventoryById(req.params.id);
        return successResponse(res, inventory, "Inventory fetched successfully");
    } catch (error) {
        next(error);
    }
};

const getInventoryByProductId = async (req, res, next) => {
    try {
        const inventory = await inventoryService.getInventoryByProductId(req.params.productId);
        return successResponse(res, inventory, "Inventory fetched successfully");
    } catch (error) {
        next(error);
    }
};

const updateInventory = async (req, res, next) => {
    try {
        const inventory = await inventoryService.updateInventory(req.params.id, req.body);
        return successResponse(res, inventory, "Inventory updated successfully");
    } catch (error) {
        next(error);
    }
};

const deleteInventory = async (req, res, next) => {
    try {
        const inventory = await inventoryService.deleteInventory(req.params.id);
        return successResponse(res, inventory, "Inventory deleted successfully");
    } catch (error) {
        next(error);
    }
};

const getFeaturedInventories = async (req, res, next) => {
    try {
        const inventories = await inventoryService.getFeaturedInventories();
        return successResponse(res, inventories, "Featured inventories fetched successfully");
    } catch (error) {
        next(error);
    }
};

const updateInventoryWholesale = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { min_wholesale_qty, wholesale_price } = req.body;

        const updatedInventory = await inventoryService.updateInventoryWholesale(id, {
            min_wholesale_qty,
            wholesale_price
        });

        return successResponse(res, updatedInventory, "Wholesale details updated successfully");
    } catch (error) {
        next(error);
    }
};

const getWholesaleProducts = async (req, res, next) => {
    try {
        const wholesaleItems = await inventoryService.getWholesaleProducts();
        return successResponse(res, wholesaleItems, "Wholesale products fetched successfully");
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
    getFeaturedInventories,
    updateInventoryWholesale,
    getWholesaleProducts
};