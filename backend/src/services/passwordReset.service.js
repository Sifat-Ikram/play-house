const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const resetModel = require("../models/passwordReset.model");
const { sendMail } = require("../utils/mailer");

const sha256 = (t) => crypto.createHash("sha256").update(t).digest("hex");

const requestReset = async (email) => {
  const user = await userModel.getUserByEmail(email);
  if (!user) return;

  const token = crypto.randomBytes(32).toString("hex");
  await resetModel.createReset(
    user.id,
    sha256(token),
    new Date(Date.now() + 30 * 60 * 1000),
  );

  const base = process.env.FRONTEND_URL || "http://localhost:3000";
  const link = `${base}/reset-password?token=${token}`;

  await sendMail({
    to: user.email,
    subject: "Reset your Play House password",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
        <h2>Hi ${user.name},</h2>
        <p>We received a request to reset your Play House password. This link works for 30 minutes.</p>
        <p><a href="${link}" style="display:inline-block;background:#F5A623;color:#1E2B2B;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold">Reset password</a></p>
        <p style="color:#666;font-size:12px">If you didn't ask for this, you can safely ignore this email.</p>
      </div>`,
  });
};

const resetPassword = async (token, newPassword) => {
  const row = await resetModel.findValid(sha256(token));

  if (!row) {
    const error = new Error("This reset link is invalid or has expired");
    error.statusCode = 400;
    throw error;
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await resetModel.consumeAndSetPassword(row.id, row.user_id, passwordHash);
};

module.exports = { requestReset, resetPassword };
