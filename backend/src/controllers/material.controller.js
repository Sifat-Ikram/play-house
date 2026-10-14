const materialModel = require("../models/material.model");

const handleError = (res, error) => {
  if (error.code === "23505") {
    return res
      .status(409)
      .json({ success: false, message: "This material already exists" });
  }
  return res
    .status(error.statusCode || 500)
    .json({ success: false, message: error.message });
};

const getMaterials = async (req, res) => {
  try {
    return res
      .status(200)
      .json({ success: true, data: await materialModel.getMaterials() });
  } catch (error) {
    return handleError(res, error);
  }
};

const createMaterial = async (req, res) => {
  try {
    const name = req.body.material_name?.trim();
    if (!name)
      return res
        .status(400)
        .json({ success: false, message: "material_name is required" });
    const material = await materialModel.createMaterial({
      material_name: name,
    });
    return res.status(201).json({ success: true, data: material });
  } catch (error) {
    return handleError(res, error);
  }
};

const updateMaterial = async (req, res) => {
  try {
    const name = req.body.material_name?.trim();
    if (!name)
      return res
        .status(400)
        .json({ success: false, message: "material_name is required" });
    const material = await materialModel.updateMaterial(req.params.id, {
      material_name: name,
    });
    if (!material)
      return res
        .status(404)
        .json({ success: false, message: "Material not found" });
    return res.status(200).json({ success: true, data: material });
  } catch (error) {
    return handleError(res, error);
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const material = await materialModel.deleteMaterial(req.params.id);
    if (!material)
      return res
        .status(404)
        .json({ success: false, message: "Material not found" });
    return res.status(200).json({ success: true, message: "Material deleted" });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = {
  getMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
};
