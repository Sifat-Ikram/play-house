const { pool } = require("../config/db");
const { requireAuth } = require("./auth.middleware");

const checkAdminRole = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT role FROM users WHERE id = $1", [
      req.user.id,
    ]);

    if (!result.rows[0] || result.rows[0].role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Admin access required" });
    }

    next();
  } catch (error) {
    next(error);
  }
};

const requireAdmin = [requireAuth, checkAdminRole];

module.exports = { requireAdmin };
