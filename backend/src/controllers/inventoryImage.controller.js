const imageService = require("../services/inventoryImage.service");
const { successResponse } = require("../utils/response");

const createInventoryImage = async (req, res, next) => {
  try {
    const image = await imageService.createInventoryImage(req.body);

    return successResponse(
      res,
      image,
      "Inventory image created successfully",
      201,
    );
  } catch (error) {
    next(error);
  }
};

const getImagesByInventoryId = async (req, res, next) => {
  try {
    const images = await imageService.getImagesByInventoryId(
      req.params.inventoryId,
    );

    return successResponse(
      res,
      images,
      "Inventory images fetched successfully",
    );
  } catch (error) {
    next(error);
  }
};

const getInventoryImageById = async (req, res, next) => {
  try {
    const image = await imageService.getInventoryImageById(req.params.id);

    return successResponse(res, image, "Inventory image fetched successfully");
  } catch (error) {
    next(error);
  }
};

const updateInventoryImage = async (req, res, next) => {
  try {
    const image = await imageService.updateInventoryImage(
      req.params.id,
      req.body,
    );

    return successResponse(res, image, "Inventory image updated successfully");
  } catch (error) {
    next(error);
  }
};

const deleteInventoryImage = async (req, res, next) => {
  try {
    const image = await imageService.deleteInventoryImage(req.params.id);

    return successResponse(res, image, "Inventory image deleted successfully");
  } catch (error) {
    next(error);
  }
};

const collectInventoryImages = async (req, res, next) => {
  try {
    const limit = req.body?.limit ?? req.query?.limit ?? 3;
    const result = await imageService.collectInventoryImages(limit);

    return successResponse(res, {
      message: "Inventory image collection completed",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInventoryImage,
  getImagesByInventoryId,
  getInventoryImageById,
  updateInventoryImage,
  deleteInventoryImage,
  collectInventoryImages,
};
