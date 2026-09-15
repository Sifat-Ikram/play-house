const inventoryModel = require("../models/inventory.model");

const createInventory = async (data) => {
    if (!data.product_id) {
        throw new Error("Product ID is required");
    }

    if (data.quantity === undefined) {
        throw new Error("Quantity is required");
    }

    if (data.base_price === undefined) {
        throw new Error("Base price is required");
    }

    if (data.selling_price === undefined) {
        throw new Error("Selling price is required");
    }

    if (data.quantity < 0) {
        throw new Error("Quantity cannot be negative");
    }

    if (data.base_price < 0 || data.selling_price < 0) {
        throw new Error("Price cannot be negative");
    }

    if (data.selling_price < data.base_price) {
        throw new Error(
            "Selling price cannot be lower than base price"
        );
    }

    return await inventoryModel.createInventory(data);
};

const getInventoryById = async (id) => {
    const inventory = await inventoryModel.getInventoryById(id);

    if (!inventory) {
        throw new Error("Inventory not found");
    }

    return inventory;
};

const getInventoryByProductId = async (productId) => {
    return await inventoryModel.getInventoryByProductId(productId);
};

const updateInventory = async (id, data) => {
    const inventory = await inventoryModel.getInventoryById(id);

    if (!inventory) {
        throw new Error("Inventory not found");
    }

    if (data.quantity !== undefined && data.quantity < 0) {
        throw new Error("Quantity cannot be negative");
    }

    if (
        data.base_price !== undefined &&
        data.base_price < 0
    ) {
        throw new Error("Base price cannot be negative");
    }

    if (
        data.selling_price !== undefined &&
        data.selling_price < 0
    ) {
        throw new Error("Selling price cannot be negative");
    }

    return await inventoryModel.updateInventory(id, data);
};

const deleteInventory = async (id) => {
    const inventory = await inventoryModel.getInventoryById(id);

    if (!inventory) {
        throw new Error("Inventory not found");
    }

    return await inventoryModel.deleteInventory(id);
};

const getFeaturedInventories = async () => {
    return await inventoryModel.getFeaturedInventories();
};

module.exports = {
    createInventory,
    getInventoryById,
    getInventoryByProductId,
    updateInventory,
    deleteInventory,
    getFeaturedInventories,
};