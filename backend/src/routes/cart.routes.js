const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

router.post("/", cartController.addToCart);
router.get("/:cartToken", cartController.getCart);
router.put("/:id", cartController.updateQuantity);
router.delete("/:id", cartController.removeItem);

module.exports = router;
