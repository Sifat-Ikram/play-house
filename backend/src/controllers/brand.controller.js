const brandService = require("../services/brand.service");

const createBrand = async (req, res) => {
    try {
        const brand = await brandService.createBrand(req.body);
        return res.status(201).json({ success: true, message: "Brand created successfully", data: brand });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getBrands = async (req, res) => {
    try {
        const brands = await brandService.getAllBrands();
        return res.status(200).json({ success: true, data: brands });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getBrandById = async (req, res) => {
    try {
        const brand = await brandService.getBrandById(req.params.id);
        return res.status(200).json({ success: true, data: brand });
    } catch (error) {
        return res.status(404).json({ success: false, message: error.message });
    }
};

const updateBrand = async (req, res) => {
    try {
        const updatedBrand = await brandService.updateBrand(req.params.id, req.body);
        return res.status(200).json({ success: true, message: "Brand updated successfully", data: updatedBrand });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const deleteBrand = async (req, res) => {
    try {
        await brandService.deleteBrand(req.params.id);
        return res.status(200).json({ success: true, message: "Brand deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createBrand,
    getBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
};