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

module.exports = {
    createProduct,
    getProductById,
    getAllProducts,
    updateProduct,
    deleteProduct,
    getNewArrivalProducts
};