const nodemailer = require("nodemailer");

function hasSmtpConfig() {
  return Boolean(
    process.env.EMAIL_HOST &&
      process.env.EMAIL_PORT &&
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASS
  );
}

function createTransporter() {
  if (!hasSmtpConfig()) return null;

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

async function sendResetEmail(to, link) {
  const transporter = createTransporter();

  if (!transporter) {
    return {
      sent: false,
      reason: "SMTP is not configured",
    };
  }

  await transporter.sendMail({
    from: `"Dvince" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to,
    subject: "Reset your Dvince password",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827; max-width: 560px;">
        <h2 style="margin-bottom: 8px;">Reset your password</h2>
        <p>You asked to reset your Dvince password. Use the button below to choose a new one.</p>
        <p style="margin: 28px 0;">
          <a href="${link}" style="background: #06b6d4; color: #ffffff; padding: 12px 18px; border-radius: 10px; text-decoration: none; font-weight: 700;">
            Set new password
          </a>
        </p>
        <p style="font-size: 14px; color: #4b5563;">This link expires in 15 minutes.</p>
        <p style="font-size: 14px; color: #4b5563;">If you did not request this, you can ignore this email.</p>
        <p style="font-size: 12px; color: #6b7280; word-break: break-all;">${link}</p>
      </div>
    `,
  });

  return {
    sent: true,
  };
}

module.exports = { hasSmtpConfig, sendResetEmail };
