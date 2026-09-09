import { Request, Response } from "express";
import * as videoService from "../services/video.service";
import {
    CreateInventoryVideoInput,
    UpdateInventoryVideoInput,
} from "../types/video.types";

interface VideoIdParams {
    id: string;
}

interface InventoryIdParams {
    inventoryId: string;
}

export const createInventoryVideo = async (
    req: Request<{}, {}, CreateInventoryVideoInput>,
    res: Response
) => {
    try {
        const video =
            await videoService.createInventoryVideo(req.body);

        return res.status(201).json({
            success: true,
            data: video,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to add video",
        });
    }
};

export const getInventoryVideos = async (
    req: Request<InventoryIdParams>,
    res: Response
) => {
    try {
        const videos =
            await videoService.getInventoryVideos(
                req.params.inventoryId
            );

        return res.status(200).json({
            success: true,
            data: videos,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to get videos",
        });
    }
};

export const updateInventoryVideo = async (
    req: Request<VideoIdParams, {}, UpdateInventoryVideoInput>,
    res: Response
) => {
    try {
        const video =
            await videoService.updateInventoryVideo(
                req.params.id,
                req.body
            );

        return res.status(200).json({
            success: true,
            data: video,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update video",
        });
    }
};

export const deleteInventoryVideo = async (
    req: Request<VideoIdParams>,
    res: Response
) => {
    try {
        await videoService.deleteInventoryVideo(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Video deleted successfully",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete video",
        });
    }
};