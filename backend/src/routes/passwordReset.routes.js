const express = require("express");
const router = express.Router();
const controller = require("../controllers/passwordReset.controller");
const { rateLimit } = require("../middleware/rateLimit.middleware");
const { validate } = require("../middleware/validate.middleware");
const { forgotSchema, resetSchema } = require("../utils/validators");

router.post(
  "/forgot-password",
  rateLimit({ name: "forgot", max: 5, windowMinutes: 60 }),
  validate(forgotSchema),
  controller.forgotPassword,
);
router.post(
  "/reset-password",
  rateLimit({ name: "reset", max: 10, windowMinutes: 60 }),
  validate(resetSchema),
  controller.resetPassword,
);

module.exports = router;
