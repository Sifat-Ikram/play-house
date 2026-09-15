const colorModel = require("../models/color.model");

const createColor = async (data) => colorModel.createColor(data);

const getAllColors = async () => colorModel.getColors();

const getColorById = async (colorId) => {
    const color = await colorModel.getColorById(colorId);
    if (!color) throw new Error("Color not found");
    return color;
};

const updateColor = async (colorId, data) => {
    const existing = await colorModel.getColorById(colorId);
    if (!existing) throw new Error("Color not found");
    return colorModel.updateColor(colorId, data);
};

const deleteColor = async (colorId) => {
    const existing = await colorModel.getColorById(colorId);
    if (!existing) throw new Error("Color not found");
    return colorModel.deleteColor(colorId);
};

module.exports = {
    createColor,
    getAllColors,
    getColorById,
    updateColor,
    deleteColor,
};