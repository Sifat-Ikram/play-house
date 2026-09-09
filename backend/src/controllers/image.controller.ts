import { Request, Response } from "express";
import * as imageService from "../services/image.service";
import {
    CreateInventoryImageInput,
    UpdateInventoryImageInput,
} from "../types/image.types";

interface ImageIdParams {
    id: string;
}

interface InventoryIdParams {
    inventoryId: string;
}

export const createInventoryImage = async (
    req: Request<{}, {}, CreateInventoryImageInput>,
    res: Response
) => {
    try {
        const image =
            await imageService.createInventoryImage(req.body);

        return res.status(201).json({
            success: true,
            data: image,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to add image",
        });
    }
};

export const getInventoryImages = async (
    req: Request<InventoryIdParams>,
    res: Response
) => {
    try {
        const images =
            await imageService.getInventoryImages(
                req.params.inventoryId
            );

        return res.status(200).json({
            success: true,
            data: images,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to get images",
        });
    }
};

export const updateInventoryImage = async (
    req: Request<ImageIdParams, {}, UpdateInventoryImageInput>,
    res: Response
) => {
    try {
        const image =
            await imageService.updateInventoryImage(
                req.params.id,
                req.body
            );

        return res.status(200).json({
            success: true,
            data: image,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update image",
        });
    }
};

export const deleteInventoryImage = async (
    req: Request<ImageIdParams>,
    res: Response
) => {
    try {
        await imageService.deleteInventoryImage(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Image deleted successfully",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete image",
        });
    }
};