const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const prisma = require("../prisma");
const { registerSchema, loginSchema } = require("../validators");
const { hasSmtpConfig, sendResetEmail } = require("../utils/email");

const router = express.Router();

function sendValidationError(res, err) {
  return res.status(400).json({
    error: "Validation failed",
    details: err.issues?.map((i) => ({ path: i.path.join("."), message: i.message })) ?? String(err),
  });
}

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return sendValidationError(res, parsed.error);

    const { email, password, name } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email: normalizedEmail, password: hash, name },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      token,
      id: user.id,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error("REGISTER ERROR ❌:", err);
    res.status(500).json({ error: "Failed to register" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return sendValidationError(res, parsed.error);

    const normalizedEmail = parsed.data.email.toLowerCase();

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(parsed.data.password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      id: user.id,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error("LOGIN ERROR ❌:", err);
    res.status(500).json({ error: "Failed to login" });
  }
});

/* ================= FORGOT PASSWORD ================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: "Email required" });

    const user = await prisma.user.findUnique({
      where: { email: String(email).trim().toLowerCase() },
    });
    if (!user) return res.status(404).json({ error: "This account doesn't exist" });

    const token = uuidv4();
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token, resetExpiry: expiry },
    });

    const link = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${token}`;
    console.log("RESET LINK ✅:", link);

    let emailSent = false;
    let deliveryMessage = "SMTP is not configured. Use the dev reset link below.";

    if (hasSmtpConfig()) {
      try {
        const result = await sendResetEmail(user.email, link);
        emailSent = result.sent;
        deliveryMessage = "Reset link sent to your email.";
      } catch (mailErr) {
        console.error("EMAIL SEND ERROR ❌:", mailErr.message);
        deliveryMessage = "Email delivery failed. Use the dev reset link below.";
      }
    }

    const payload = { message: deliveryMessage, emailSent };
    if (process.env.NODE_ENV !== "production") payload.link = link;
    res.json(payload);
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR ❌:", err);
    res.status(500).json({ error: "Failed to process request" });
  }
});

/* ================= RESET PASSWORD ================= */
async function handleResetPassword(req, res) {
  try {
    const token = req.params.token || req.body?.token;
    const { password } = req.body || {};
    if (!token) return res.status(400).json({ error: "Token required" });
    if (!password || String(password).length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const user = await prisma.user.findFirst({
      where: { resetToken: token, resetExpiry: { gt: new Date() } },
    });
    if (!user) return res.status(400).json({ error: "Invalid or expired token" });

    const hash = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hash, resetToken: null, resetExpiry: null },
    });

    res.json({ message: "Password reset success ✅" });
  } catch (err) {
    console.error("RESET PASSWORD ERROR ❌:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
}

router.post("/reset-password/:token", handleResetPassword);
router.post("/reset-password", handleResetPassword);

module.exports = router;
