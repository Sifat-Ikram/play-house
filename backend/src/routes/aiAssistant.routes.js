const express = require("express");
const router = express.Router();
const aiAssistantController = require("../controllers/aiAssistant.controller");

router.post("/chat", aiAssistantController.chat);

module.exports = router;
