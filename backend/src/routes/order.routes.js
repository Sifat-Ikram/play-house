const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { requireAuth } = require("../middleware/auth.middleware");

router.post("/", orderController.placeOrder);
router.get("/mine", requireAuth, orderController.getMyOrders);
router.get("/:id", orderController.getOrderById);

module.exports = router;
