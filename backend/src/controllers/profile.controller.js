const profileService = require("../services/profile.service");

const getProfile = async (req, res) => {
  try {
    const profile = await profileService.getProfile(req.user.id);
    return res.status(200).json({ success: true, data: profile });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res
      .status(statusCode)
      .json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updated = await profileService.updateProfile(req.user.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updated,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res
      .status(statusCode)
      .json({ success: false, message: error.message });
  }
};

const deleteProfile = async (req, res) => {
  try {
    await profileService.deleteProfile(req.user.id);
    return res
      .status(200)
      .json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res
      .status(statusCode)
      .json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, updateProfile, deleteProfile };
