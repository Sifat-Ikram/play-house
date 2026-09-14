const productService = require("../services/product.service");
const {
    successResponse,
    errorResponse,
} = require("../utils/response");

const createProduct = async (req, res, next) => {
    try {
        const product = await productService.createProduct(req.body);

        return successResponse(
            res,
            product,
            "Product created successfully",
            201
        );
    } catch (error) {
        next(error);
    }
};

const getProducts = async (req, res, next) => {
    try {
        const products = await productService.getProducts();

        return successResponse(
            res,
            products,
            "Products fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};

const getProductById = async (req, res, next) => {
    try {
        const product = await productService.getProductById(
            req.params.id
        );

        return successResponse(
            res,
            product,
            "Product fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const product = await productService.updateProduct(
            req.params.id,
            req.body
        );

        return successResponse(
            res,
            product,
            "Product updated successfully"
        );
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const product = await productService.deleteProduct(
            req.params.id
        );

        return successResponse(
            res,
            product,
            "Product deleted successfully"
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};