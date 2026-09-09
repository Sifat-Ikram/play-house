import { PrismaClient } from "@prisma/client/extension";
import {
    CreateInventoryImageInput,
    UpdateInventoryImageInput,
} from "../types/image.types";

const prisma = new PrismaClient();

export const createInventoryImage = async (
    data: CreateInventoryImageInput
) => {
    return await prisma.inventoryImage.create({
        data: {
            inventory_id: data.inventory_id,
            image_url: data.image_url,
            is_display_image:
                data.is_display_image ?? false,
        },
    });
};

export const getInventoryImages = async (
    inventoryId: string
) => {
    return await prisma.inventoryImage.findMany({
        where: {
            inventory_id: inventoryId,
        },

        orderBy: {
            created_at: "asc",
        },
    });
};

export const updateInventoryImage = async (
    imageId: string,
    data: UpdateInventoryImageInput
) => {
    if (data.is_display_image) {
        const image = await prisma.inventoryImage.findUnique({
            where: {
                id: imageId,
            },
        });

        if (!image) {
            throw new Error("Image not found");
        }

        await prisma.inventoryImage.updateMany({
            where: {
                inventory_id: image.inventory_id,
            },

            data: {
                is_display_image: false,
            },
        });
    }

    return await prisma.inventoryImage.update({
        where: {
            id: imageId,
        },

        data: {
            is_display_image:
                data.is_display_image,
        },
    });
};

export const deleteInventoryImage = async (
    imageId: string
) => {
    return await prisma.inventoryImage.delete({
        where: {
            id: imageId,
        },
    });
};