const { pool } = require("../config/db");
const { requireAuth } = require("./auth.middleware");

const PERMISSIONS = {
  admin: ["*"],
  staff: [
    "read",
    "catalog:write",
    "inventory:write",
    "orders:write",
    "carts:write",
    "reviews:write",
  ],
  viewer: ["read"],
};

const can = (role, perm) =>
  !!PERMISSIONS[role] &&
  (PERMISSIONS[role].includes("*") || PERMISSIONS[role].includes(perm));

const loadRole = async (req, res, next) => {
  try {
    if (req.userRole) return next();

    const result = await pool.query("SELECT role FROM users WHERE id = $1", [
      req.user.id,
    ]);
    const role = result.rows[0]?.role;

    if (!role || !PERMISSIONS[role]) {
      return res
        .status(403)
        .json({ success: false, message: "Admin panel access required" });
    }

    req.userRole = role;
    next();
  } catch (error) {
    next(error);
  }
};

const allow = (perm) => (req, res, next) => {
  if (!can(req.userRole, perm)) {
    return res.status(403).json({
      success: false,
      message:
        req.userRole === "viewer"
          ? "View-only account: changes are disabled"
          : "You don't have permission to do this",
    });
  }
  next();
};

const requirePermission = (perm) => [requireAuth, loadRole, allow(perm)];

const requireAdmin = requirePermission("*");

module.exports = { requirePermission, requireAdmin, allow, loadRole, can };
