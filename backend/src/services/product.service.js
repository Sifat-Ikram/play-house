const productModel = require("../models/product.model");

const createProduct = async (productData) => {
    return await productModel.createProduct(productData);
};

const getProductById = async (id) => {
    const product = await productModel.getProductById(id);
    if (!product) {
        throw new Error("Product not found");
    }
    return product;
};

const getAllProducts = async () => {
    return await productModel.getProducts();
};

const updateProduct = async (id, updateData) => {
    const existingProduct = await productModel.getProductById(id);
    if (!existingProduct) {
        throw new Error("Product not found");
    }
    return await productModel.updateProduct(id, updateData);
};

const deleteProduct = async (id) => {
    const existingProduct = await productModel.getProductById(id);
    if (!existingProduct) {
        throw new Error("Product not found");
    }
    return await productModel.deleteProduct(id);
};

const getNewArrivalProducts = async () => {
    return await productModel.getNewArrivalProducts();
};

const getFeaturedProducts = async () => {
    return await productModel.getFeaturedProducts();
};

const fetchProductByName = async (name) => {
    if (!name) {
        throw new Error("Product name is required");
    }

    const product = await productModel.getProductByName(name);

    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    return product;
};

module.exports = {
    createProduct,
    getProductById,
    getAllProducts,
    updateProduct,
    deleteProduct,
    getNewArrivalProducts,
    getFeaturedProducts,
    fetchProductByName
};