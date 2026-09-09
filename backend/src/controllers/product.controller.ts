import { Request, Response } from "express";
import * as productService from "../services/product.service";
import {
    CreateProductInput,
    UpdateProductInput,
} from "../types/product.types";

interface ProductIdParams {
    id: string;
}

export const createProduct = async (
    req: Request<{}, {}, CreateProductInput>,
    res: Response
) => {
    try {
        const product = await productService.createProduct(req.body);

        return res.status(201).json({
            success: true,
            data: product,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create product",
        });
    }
};

export const getProducts = async (
    req: Request,
    res: Response
) => {
    try {
        const products = await productService.getProducts();

        return res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to get products",
        });
    }
};

export const getProductById = async (
    req: Request<ProductIdParams>,
    res: Response
) => {
    try {
        const product = await productService.getProductById(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to get product",
        });
    }
};

export const getProductDetails = async (
    req: Request<ProductIdParams>,
    res: Response
) => {
    try {
        const product = await productService.getProductDetails(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to get product details",
        });
    }
};

export const updateProduct = async (
    req: Request<ProductIdParams, {}, UpdateProductInput>,
    res: Response
) => {
    try {
        const product = await productService.updateProduct(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update product",
        });
    }
};

export const deleteProduct = async (
    req: Request<ProductIdParams>,
    res: Response
) => {
    try {
        await productService.deleteProduct(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete product",
        });
    }
};