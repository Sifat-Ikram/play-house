import { Request, Response } from "express";
import * as inventoryService from "../services/inventory.service";
import {
    CreateInventoryInput,
    UpdateInventoryInput,
} from "../types/inventory.types";

interface InventoryIdParams {
    id: string;
}

interface ProductIdParams {
    productId: string;
}

export const createInventory = async (
    req: Request<{}, {}, CreateInventoryInput>,
    res: Response
) => {
    try {
        const inventory =
            await inventoryService.createInventory(req.body);

        return res.status(201).json({
            success: true,
            data: inventory,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create inventory",
        });
    }
};

export const getInventoryById = async (
    req: Request<InventoryIdParams>,
    res: Response
) => {
    try {
        const inventory =
            await inventoryService.getInventoryById(
                req.params.id
            );

        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: "Inventory not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: inventory,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to get inventory",
        });
    }
};

export const getInventoriesByProduct = async (
    req: Request<ProductIdParams>,
    res: Response
) => {
    try {
        const inventories =
            await inventoryService.getInventoriesByProduct(
                req.params.productId
            );

        return res.status(200).json({
            success: true,
            data: inventories,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to get inventories",
        });
    }
};

export const updateInventory = async (
    req: Request<InventoryIdParams, {}, UpdateInventoryInput>,
    res: Response
) => {
    try {
        const inventory =
            await inventoryService.updateInventory(
                req.params.id,
                req.body
            );

        return res.status(200).json({
            success: true,
            data: inventory,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update inventory",
        });
    }
};

export const deleteInventory = async (
    req: Request<InventoryIdParams>,
    res: Response
) => {
    try {
        await inventoryService.deleteInventory(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Inventory deleted successfully",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete inventory",
        });
    }
};