const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const { optionalAuth } = require("../middleware/optionalAuth.middleware");
const { requireAuth } = require("../middleware/auth.middleware");

router.post("/", optionalAuth, cartController.addToCart);
router.get("/", optionalAuth, cartController.getCart);
router.put("/:id", optionalAuth, cartController.updateQuantity);
router.delete("/:id", optionalAuth, cartController.removeItem);
router.post("/merge", requireAuth, cartController.mergeCart);

module.exports = router;
