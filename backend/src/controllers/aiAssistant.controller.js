const aiAssistantService = require("../services/aiAssistant.service");

const chat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Message is required" });
    }

    const result = await aiAssistantService.chat(message.trim(), history || []);

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("AI Assistant error:", error);
    return res.status(500).json({
      success: false,
      message:
        "Something went wrong talking to the assistant. Please try again.",
    });
  }
};

module.exports = { chat };
