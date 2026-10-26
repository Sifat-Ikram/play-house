const nodemailer = require("nodemailer");

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
};

const sendMail = ({ to, subject, html }) =>
  getTransporter().sendMail({
    from: `"Play House" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });

module.exports = { sendMail };
