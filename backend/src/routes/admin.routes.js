const express = require("express");
const multer = require("multer");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const adminOrderController = require("../controllers/adminOrder.controller");
const { uploadImage } = require("../controllers/upload.controller");
const {
  requirePermission,
  requireAdmin,
  allow,
} = require("../middleware/admin.middleware");
const { validate } = require("../middleware/validate.middleware");
const { roleSchema } = require("../utils/validators");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/"))
      return cb(new Error("Only image files are allowed"));
    cb(null, true);
  },
});

// admin / staff / viewer সবাই ঢুকতে পারবে; লেখার জন্য আলাদা permission
router.use(requirePermission("read"));

router.get("/stats", adminController.getStats);

// Users: privacy-র জন্য শুধু admin
router.get("/users", requireAdmin, adminController.listUsers);
router.patch(
  "/users/:id/role",
  requireAdmin,
  validate(roleSchema),
  adminController.updateUserRole,
);

router.get("/products", adminController.listProducts);
router.get("/products/:id", adminController.getProduct);
router.patch(
  "/products/:id/featured",
  allow("catalog:write"),
  adminController.setFeatured,
);

router.post(
  "/inventory",
  allow("inventory:write"),
  adminController.createInventory,
);
router.put(
  "/inventory/:id",
  allow("inventory:write"),
  adminController.updateInventory,
);
router.delete("/inventory/:id", allow("*"), adminController.deleteInventory);

router.get("/orders", adminOrderController.listOrders);
router.get("/orders/:id", adminOrderController.getOrder);
router.patch(
  "/orders/:id/status",
  allow("orders:write"),
  adminOrderController.updateStatus,
);

router.get("/carts", adminOrderController.listCarts);
router.put(
  "/carts/:id",
  allow("carts:write"),
  adminOrderController.updateCartItem,
);
router.delete(
  "/carts/:id",
  allow("carts:write"),
  adminOrderController.deleteCartItem,
);

router.post(
  "/upload",
  allow("inventory:write"),
  upload.single("file"),
  uploadImage,
);

module.exports = router;
