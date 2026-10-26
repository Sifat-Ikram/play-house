const service = require("../services/passwordReset.service");

const forgotPassword = async (req, res) => {
  try {
    await service.requestReset(req.body.email);
  } catch (error) {
    console.error("Forgot password error:", error.message);
  }
  return res.status(200).json({
    success: true,
    message: "If an account exists for that email, a reset link has been sent.",
  });
};

const resetPassword = async (req, res) => {
  try {
    await service.resetPassword(req.body.token, req.body.password);
    return res
      .status(200)
      .json({
        success: true,
        message: "Password updated. You can log in now.",
      });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
};

module.exports = { forgotPassword, resetPassword };
