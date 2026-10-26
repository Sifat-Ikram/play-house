const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { rateLimit } = require("../middleware/rateLimit.middleware");
const { validate } = require("../middleware/validate.middleware");
const { registerSchema, loginSchema } = require("../utils/validators");

router.post(
  "/register",
  rateLimit({ name: "register", max: 5, windowMinutes: 60 }),
  validate(registerSchema),
  authController.register,
);
router.post(
  "/login",
  rateLimit({ name: "login", max: 10, windowMinutes: 15 }),
  validate(loginSchema),
  authController.login,
);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

module.exports = router;
