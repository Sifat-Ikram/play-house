const express = require("express");
const multer = require("multer");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { uploadImage } = require("../controllers/upload.controller");
const { requireAdmin } = require("../middleware/admin.middleware");
const adminOrderController = require("../controllers/adminOrder.controller");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/"))
      return cb(new Error("Only image files are allowed"));
    cb(null, true);
  },
});

router.use(requireAdmin);

router.get("/stats", adminController.getStats);
router.get("/users", adminController.listUsers);

router.get("/products", adminController.listProducts);
router.get("/products/:id", adminController.getProduct);
router.patch("/products/:id/featured", adminController.setFeatured);

router.post("/inventory", adminController.createInventory);
router.put("/inventory/:id", adminController.updateInventory);
router.delete("/inventory/:id", adminController.deleteInventory);

router.get("/orders", adminOrderController.listOrders);
router.get("/orders/:id", adminOrderController.getOrder);
router.patch("/orders/:id/status", adminOrderController.updateStatus);

router.get("/carts", adminOrderController.listCarts);
router.put("/carts/:id", adminOrderController.updateCartItem);
router.delete("/carts/:id", adminOrderController.deleteCartItem);

router.post("/upload", upload.single("file"), uploadImage);

module.exports = router;
