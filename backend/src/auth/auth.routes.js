const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const prisma = require("../prisma");

const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hash,
        name,
      },
    });

    res.status(201).json(user);
  } catch (err) {
    console.error("REGISTER ERROR ❌:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: "insensitive",
        },
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.json({ token, id: user.id });
  } catch (err) {
    console.error("LOGIN ERROR ❌:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ================= FORGOT PASSWORD ================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: "insensitive",
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "This account doesn't exist" });
    }

    const token = uuidv4();
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetExpiry: expiry,
      },
    });

    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    console.log("RESET LINK ✅:", link);

    res.json({
      message: "Reset link generated ✅",
      link,
    });

  } catch (err) {
    console.error("FORGOT PASSWORD ERROR ❌:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ================= RESET PASSWORD ================= */
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const hash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hash,
        resetToken: null,
        resetExpiry: null,
      },
    });

    res.json({ message: "Password reset success ✅" });

  } catch (err) {
    console.error("RESET PASSWORD ERROR ❌:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;