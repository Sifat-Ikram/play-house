const userModel = require("../models/user.model");

const getProfile = async (userId) => {
  const user = await userModel.getUserById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

const updateProfile = async (userId, data) => {
  const allowedFields = ["name", "phone_number", "addresses"];
  const updateData = {};

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  }

  if (Object.keys(updateData).length === 0) {
    const error = new Error("No valid fields to update");
    error.statusCode = 400;
    throw error;
  }

  const updated = await userModel.updateUser(userId, updateData);

  if (!updated) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return updated;
};

const deleteProfile = async (userId) => {
  const deleted = await userModel.deleteUser(userId);

  if (!deleted) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return deleted;
};

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
};
