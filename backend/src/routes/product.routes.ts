import { Router } from "express";

import {
    createProduct,
    getProducts,
    getProductById,
    getProductDetails,
    updateProduct,
    deleteProduct,
} from "../controllers/product.controller";

const router = Router();

// Create product
router.post("/", createProduct);

// Get all products
router.get("/", getProducts);

// Get complete product details
router.get("/:id/details", getProductDetails);

// Get single product
router.get("/:id", getProductById);

// Update product
router.patch("/:id", updateProduct);

// Delete product
router.delete("/:id", deleteProduct);

export default router;