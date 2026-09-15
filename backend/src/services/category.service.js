const categoryModel = require("../models/category.model");

const createCategory = async (data) => categoryModel.createCategory(data);

const getAllCategories = async () => categoryModel.getCategories();

const getCategoryById = async (categoryId) => {
    const category = await categoryModel.getCategoryById(categoryId);
    if (!category) throw new Error("Category not found");
    return category;
};

const updateCategory = async (categoryId, data) => {
    const existing = await categoryModel.getCategoryById(categoryId);
    if (!existing) throw new Error("Category not found");
    return categoryModel.updateCategory(categoryId, data);
};

const deleteCategory = async (categoryId) => {
    const existing = await categoryModel.getCategoryById(categoryId);
    if (!existing) throw new Error("Category not found");
    return categoryModel.deleteCategory(categoryId);
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};