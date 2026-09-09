
import { PrismaClient } from "@prisma/client/extension";
import {
    CreateProductInput,
    UpdateProductInput,
} from "../types/product.types";

const prisma = new PrismaClient();

export const createProduct = async (
    data: CreateProductInput
) => {
    const product = await prisma.product.create({
        data: {
            category_id: data.category_id,
            brand_id: data.brand_id,
            name: data.name,
            number_of_pieces: data.number_of_pieces,
            warranty_info: data.warranty_info,
            minimum_age_range: data.minimum_age_range,
            maximum_age_range: data.maximum_age_range,
            description: data.description,
            in_the_box: data.in_the_box,
            return_and_refund_policy: data.return_and_refund_policy,

            summary: data.summary
                ? JSON.stringify(data.summary)
                : null,

            dimensions: data.dimensions
                ? JSON.stringify(data.dimensions)
                : null,
        },
    });

    return product;
};

export const getProductById = async (
    productId: string
) => {
    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },
    });

    return product;
};

export const getProductDetails = async (
    productId: string
) => {
    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },

        include: {
            inventories: {
                include: {
                    images: true,
                    videos: true,
                    color: true,
                },
            },

            category: true,
            brand: true,

            materials: {
                include: {
                    material: true,
                },
            },

            reviews: true,
        },
    });

    return product;
};

export const getProducts = async () => {
    const products = await prisma.product.findMany({
        orderBy: {
            created_at: "desc",
        },
    });

    return products;
};

export const updateProduct = async (
    productId: string,
    data: UpdateProductInput
) => {
    const product = await prisma.product.update({
        where: {
            id: productId,
        },

        data: {
            category_id: data.category_id,
            brand_id: data.brand_id,
            name: data.name,
            number_of_pieces: data.number_of_pieces,
            warranty_info: data.warranty_info,
            minimum_age_range: data.minimum_age_range,
            maximum_age_range: data.maximum_age_range,
            description: data.description,
            in_the_box: data.in_the_box,
            return_and_refund_policy:
                data.return_and_refund_policy,

            summary: data.summary
                ? JSON.stringify(data.summary)
                : undefined,

            dimensions: data.dimensions
                ? JSON.stringify(data.dimensions)
                : undefined,
        },
    });

    return product;
};

export const deleteProduct = async (
    productId: string
) => {
    return await prisma.product.delete({
        where: {
            id: productId,
        },
    });
};