console.log("SERVER FILE LOADED");

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const prisma = require("./prisma");
const authRoutes = require("./auth/auth.routes");
const authMiddleware = require("./middleware/auth");
const {
  userCreateSchema,
  userUpdateSchema,
} = require("./validators");

const app = express();

app.use(cors());
app.use(express.json());

/* ROOT */
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

/* AUTH ROUTES */
app.use("/auth", authRoutes);

/* USERS CRUD (optional / admin-like) */
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch {
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/users", async (req, res) => {
  try {
    const data = userCreateSchema.parse(req.body);
    const user = await prisma.user.create({ data });
    res.status(201).json(user);
  } catch {
    res.status(400).json({ error: "Invalid input" });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = userUpdateSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id },
      data,
    });

    res.json(user);
  } catch {
    res.status(400).json({ error: "Invalid data or user not found" });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "User not found" });
  }
});

/* PROFILE (PROTECTED) */
app.get("/me", authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { skills: true }, // ✅ include skills
  });

  res.json(user);
});

/* SKILLS (F1) */
app.post("/skills", authMiddleware, async (req, res) => {
  const { name } = req.body;

  const skill = await prisma.skill.create({
    data: {
      name,
      userId: req.user.id,
    },
  });

  res.status(201).json(skill);
});

/* SERVER START (ALWAYS LAST) */
const PORT = process.env.PORT || 5000;

// Search users
app.get("/search", async (req, res) => {
  const q = req.query.q;

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: q } },
        {
          skills: {
            some: {
              name: { contains: q },
            },
          },
        },
      ],
    },
    include: { skills: true },
  });

  res.json(users);
});
// Send message
app.post("/messages", authMiddleware, async (req, res) => {
  const { content, receiverId } = req.body;

  const message = await prisma.message.create({
    data: {
      content,
      senderId: req.user.id,
      receiverId,
    },
  });

  res.status(201).json(message);
});

// Get messages with a user
app.get("/messages/:userId", authMiddleware, async (req, res) => {
  const userId = parseInt(req.params.userId);

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: req.user.id, receiverId: userId },
        { senderId: userId, receiverId: req.user.id },
      ],
    },
    orderBy: { createdAt: "asc" },
  });

  res.json(messages);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});