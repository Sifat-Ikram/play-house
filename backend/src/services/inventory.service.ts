import { PrismaClient } from "@prisma/client/extension";
import {
    CreateInventoryInput,
    UpdateInventoryInput,
} from "../types/inventory.types";

const prisma = new PrismaClient();

export const createInventory = async (
    data: CreateInventoryInput
) => {
    const inventory = await prisma.inventory.create({
        data: {
            product_id: data.product_id,
            quantity: data.quantity,
            mark_unavailable: data.mark_unavailable ?? false,
            base_price: data.base_price,
            selling_price: data.selling_price,
            applicable_tax_percent:
                data.applicable_tax_percent ?? 0,
            color_id: data.color_id,
            is_featured: data.is_featured ?? false,
        },
    });

    return inventory;
};

export const getInventoryById = async (
    inventoryId: string
) => {
    return await prisma.inventory.findUnique({
        where: {
            id: inventoryId,
        },

        include: {
            images: true,
            videos: true,
            color: true,
        },
    });
};

export const getInventoriesByProduct = async (
    productId: string
) => {
    return await prisma.inventory.findMany({
        where: {
            product_id: productId,
        },

        include: {
            images: true,
            videos: true,
            color: true,
        },
    });
};

export const updateInventory = async (
    inventoryId: string,
    data: UpdateInventoryInput
) => {
    return await prisma.inventory.update({
        where: {
            id: inventoryId,
        },

        data: {
            quantity: data.quantity,
            mark_unavailable: data.mark_unavailable,

            base_price: data.base_price,
            selling_price: data.selling_price,

            applicable_tax_percent:
                data.applicable_tax_percent,

            color_id: data.color_id,

            is_featured: data.is_featured,
        },
    });
};

export const deleteInventory = async (
    inventoryId: string
) => {
    return await prisma.inventory.delete({
        where: {
            id: inventoryId,
        },
    });
};