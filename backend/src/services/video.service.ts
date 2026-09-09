import { PrismaClient } from "@prisma/client/extension";
import {
    CreateInventoryVideoInput,
    UpdateInventoryVideoInput,
} from "../types/video.types";

const prisma = new PrismaClient();

export const createInventoryVideo = async (
    data: CreateInventoryVideoInput
) => {
    return await prisma.inventoryVideo.create({
        data: {
            inventory_id: data.inventory_id,
            video_url: data.video_url,
        },
    });
};

export const getInventoryVideos = async (
    inventoryId: string
) => {
    return await prisma.inventoryVideo.findMany({
        where: {
            inventory_id: inventoryId,
        },

        orderBy: {
            created_at: "asc",
        },
    });
};

export const updateInventoryVideo = async (
    videoId: string,
    data: UpdateInventoryVideoInput
) => {
    return await prisma.inventoryVideo.update({
        where: {
            id: videoId,
        },

        data: {
            video_url: data.video_url,
        },
    });
};

export const deleteInventoryVideo = async (
    videoId: string
) => {
    return await prisma.inventoryVideo.delete({
        where: {
            id: videoId,
        },
    });
};