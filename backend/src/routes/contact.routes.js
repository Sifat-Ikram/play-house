const express = require("express");
const { z } = require("zod");
const router = express.Router();
const { rateLimit } = require("../middleware/rateLimit.middleware");
const { validate } = require("../middleware/validate.middleware");
const { sendMail } = require("../utils/mailer");

const schema = z.object({
  name: z.string().trim().min(2).max(60),
  email: z.string().trim().email().max(120),
  message: z.string().trim().min(10).max(1500),
});

const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

router.post(
  "/",
  rateLimit({ name: "contact", max: 3, windowMinutes: 60 }),
  validate(schema),
  async (req, res) => {
    try {
      const { name, email, message } = req.body;
      await sendMail({
        to: process.env.SMTP_USER,
        replyTo: email,
        subject: `Play House contact: ${name}`,
        html: `<p><b>${esc(name)}</b> (${esc(email)}) wrote:</p><p style="white-space:pre-wrap">${esc(message)}</p>`,
      });
      res
        .status(200)
        .json({
          success: true,
          message: "Message sent. We'll get back to you soon!",
        });
    } catch (e) {
      console.error("Contact error:", e.code || "", e.message);
      res
        .status(500)
        .json({
          success: false,
          message: "Could not send your message. Please try again later.",
        });
    }
  },
);

module.exports = router;
