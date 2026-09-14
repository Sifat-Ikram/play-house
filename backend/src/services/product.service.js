const productModel = require("../models/product.model");

const createProduct = async (data) => {
    if (!data.category_id) {
        throw new Error("Category is required");
    }

    if (!data.brand_id) {
        throw new Error("Brand is required");
    }

    if (!data.name) {
        throw new Error("Product name is required");
    }

    if (
        data.minimum_age_range !== undefined &&
        data.maximum_age_range !== undefined &&
        data.minimum_age_range > data.maximum_age_range
    ) {
        throw new Error("Minimum age cannot be greater than maximum age");
    }

    return await productModel.createProduct(data);
};

const getProducts = async () => {
    return await productModel.getProducts();
};

const getProductById = async (id) => {
    const product = await productModel.getProductById(id);

    if (!product) {
        throw new Error("Product not found");
    }

    return product;
};

const updateProduct = async (id, data) => {
    const product = await productModel.getProductById(id);

    if (!product) {
        throw new Error("Product not found");
    }

    if (
        data.minimum_age_range !== undefined &&
        data.maximum_age_range !== undefined &&
        data.minimum_age_range > data.maximum_age_range
    ) {
        throw new Error("Minimum age cannot be greater than maximum age");
    }

    return await productModel.updateProduct(id, data);
};

const deleteProduct = async (id) => {
    const product = await productModel.getProductById(id);

    if (!product) {
        throw new Error("Product not found");
    }

    return await productModel.deleteProduct(id);
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};