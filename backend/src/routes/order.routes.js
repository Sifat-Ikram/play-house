const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const tracking = require("../controllers/orderTracking.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const { rateLimit } = require("../middleware/rateLimit.middleware");
const { validate } = require("../middleware/validate.middleware");
const { trackSchema, returnSchema } = require("../utils/validators");

router.post("/", orderController.placeOrder);
router.get("/mine", requireAuth, orderController.getMyOrders);

router.post(
  "/track",
  rateLimit({ name: "track", max: 20, windowMinutes: 15 }),
  validate(trackSchema),
  tracking.trackGuest,
);
router.get("/mine/:id/track", requireAuth, tracking.trackMine);
router.post(
  "/:id/return",
  requireAuth,
  validate(returnSchema),
  tracking.requestReturn,
);

router.get("/:id", orderController.getOrderById);

module.exports = router;
