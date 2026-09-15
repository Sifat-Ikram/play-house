const colorService = require("../services/color.service");

const createColor = async (req, res) => {
    try {
        const color = await colorService.createColor(req.body);
        return res.status(201).json({ success: true, message: "Color created successfully", data: color });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getColors = async (req, res) => {
    try {
        const colors = await colorService.getAllColors();
        return res.status(200).json({ success: true, data: colors });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getColorById = async (req, res) => {
    try {
        const color = await colorService.getColorById(req.params.id);
        return res.status(200).json({ success: true, data: color });
    } catch (error) {
        return res.status(404).json({ success: false, message: error.message });
    }
};

const updateColor = async (req, res) => {
    try {
        const updatedColor = await colorService.updateColor(req.params.id, req.body);
        return res.status(200).json({ success: true, message: "Color updated successfully", data: updatedColor });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const deleteColor = async (req, res) => {
    try {
        await colorService.deleteColor(req.params.id);
        return res.status(200).json({ success: true, message: "Color deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createColor,
    getColors,
    getColorById,
    updateColor,
    deleteColor,
};