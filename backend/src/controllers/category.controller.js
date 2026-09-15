const categoryService = require("../services/category.service");

const createCategory = async (req, res) => {
    try {
        const category = await categoryService.createCategory(req.body);
        return res.status(201).json({ success: true, message: "Category created successfully", data: category });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        return res.status(200).json({ success: true, data: categories });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        return res.status(200).json({ success: true, data: category });
    } catch (error) {
        return res.status(404).json({ success: false, message: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const updatedCategory = await categoryService.updateCategory(req.params.id, req.body);
        return res.status(200).json({ success: true, message: "Category updated successfully", data: updatedCategory });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        await categoryService.deleteCategory(req.params.id);
        return res.status(200).json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};