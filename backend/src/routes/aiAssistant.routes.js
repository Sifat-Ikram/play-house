const express = require("express");
const router = express.Router();
const aiAssistantController = require("../controllers/aiAssistant.controller");
const { rateLimit } = require("../middleware/rateLimit.middleware");
const { validate } = require("../middleware/validate.middleware");
const { chatSchema } = require("../utils/validators");

router.post(
  "/chat",
  rateLimit({ name: "ai", max: 20, windowMinutes: 10 }),
  validate(chatSchema),
  aiAssistantController.chat,
);

module.exports = router;
