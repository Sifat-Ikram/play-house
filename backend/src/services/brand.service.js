const brandModel = require("../models/brand.model");

const createBrand = async (data) => brandModel.createBrand(data);

const getAllBrands = async () => brandModel.getBrands();

const getBrandById = async (brandId) => {
    const brand = await brandModel.getBrandById(brandId);
    if (!brand) throw new Error("Brand not found");
    return brand;
};

const updateBrand = async (brandId, data) => {
    const existing = await brandModel.getBrandById(brandId);
    if (!existing) throw new Error("Brand not found");
    return brandModel.updateBrand(brandId, data);
};

const deleteBrand = async (brandId) => {
    const existing = await brandModel.getBrandById(brandId);
    if (!existing) throw new Error("Brand not found");
    return brandModel.deleteBrand(brandId);
};

module.exports = {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
};