console.log("SERVER FILE LOADED");

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const prisma = require("./prisma");
const authRoutes = require("./auth/auth.routes");
const authMiddleware = require("./middleware/auth");

const {
  profileUpdateSchema,
  skillSchema,
  messageSchema,
  reactionSchema,
} = require("./validators");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

function sendValidationError(res, err) {
  return res.status(400).json({
    error: "Validation failed",
    details:
      err.issues?.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })) ?? String(err),
  });
}

// ==========================
// HELPERS
// ==========================

function sanitizeUser(user) {
  if (!user) return null;

  const { password, resetToken, resetExpiry, ...safe } = user;

  return safe;
}

function shapeSkill(skill) {
  if (!skill) return null;

  let days = [];

  try {
    days = skill.scheduleDays
      ? JSON.parse(skill.scheduleDays)
      : [];
  } catch {
    days = [];
  }

  return {
    id: skill.id,
    name: skill.name,
    category: skill.category || "",
    subCategory: skill.subCategory || "",
    experienceLevel: skill.experienceLevel || "",
    description: skill.description || "",
    preferences: skill.preferences || "",

    schedule: {
      days,
      timeStart: skill.scheduleStart || "",
      timeEnd: skill.scheduleEnd || "",
    },

    userId: skill.userId,
    createdAt: skill.createdAt,
  };
}

function shapeUser(user) {
  const safe = sanitizeUser(user);

  if (!safe) return null;

  if (Array.isArray(safe.skills)) {
    safe.skills = safe.skills.map(shapeSkill);
  }

  return safe;
}

// ==========================
// ROOT
// ==========================

app.get("/", (_req, res) => {
  res.send("Dvince API is running 🚀");
});

// ==========================
// AUTH
// ==========================

app.use("/auth", authRoutes);

// ==========================
// PROFILE
// ==========================

app.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },

      include: {
        skills: true,
        posts: true,
        followers: true,
        following: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json(shapeUser(user));
  } catch (err) {
    console.error("GET /me ERROR:", err);

    res.status(500).json({
      error: "Failed to load profile",
    });
  }
});

app.put("/me", authMiddleware, async (req, res) => {
  try {
    const parsed = profileUpdateSchema.safeParse(req.body);

    if (!parsed.success) {
      return sendValidationError(res, parsed.error);
    }

    const user = await prisma.user.update({
      where: {
        id: req.user.id,
      },

      data: parsed.data,

      include: {
        skills: true,
      },
    });

    res.json(shapeUser(user));
  } catch (err) {
    console.error("PUT /me ERROR:", err);

    res.status(500).json({
      error: "Failed to update profile",
    });
  }
});

// ==========================
// USERS
// ==========================

app.get("/users/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: "Invalid id",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id },

      include: {
        skills: true,
        posts: {
          orderBy: {
            createdAt: "desc",
          },
        },

        followers: true,
        following: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json(shapeUser(user));
  } catch (err) {
    console.error("GET /users/:id ERROR:", err);

    res.status(500).json({
      error: "Failed to load user",
    });
  }
});

app.get("/users/:id/skills", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: "Invalid id",
      });
    }

    const skills = await prisma.skill.findMany({
      where: {
        userId: id,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(skills.map(shapeSkill));
  } catch (err) {
    console.error("GET /users/:id/skills ERROR:", err);

    res.status(500).json({
      error: "Failed to load skills",
    });
  }
});

// ==========================
// SKILLS
// ==========================

function buildSkillData(input, userId) {
  return {
    name: input.name,
    category: input.category ?? null,
    subCategory: input.subCategory ?? null,
    experienceLevel: input.experienceLevel ?? null,
    description: input.description ?? null,
    preferences: input.preferences ?? null,

    scheduleDays: input.schedule?.days
      ? JSON.stringify(input.schedule.days)
      : null,

    scheduleStart: input.schedule?.timeStart ?? null,
    scheduleEnd: input.schedule?.timeEnd ?? null,

    userId,
  };
}

app.get("/skills", authMiddleware, async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      where: {
        userId: req.user.id,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(skills.map(shapeSkill));
  } catch (err) {
    console.error("GET /skills ERROR:", err);

    res.status(500).json({
      error: "Failed to load skills",
    });
  }
});

app.post("/skills", authMiddleware, async (req, res) => {
  try {
    const parsed = skillSchema.safeParse(req.body);

    if (!parsed.success) {
      return sendValidationError(res, parsed.error);
    }

    const skill = await prisma.skill.create({
      data: buildSkillData(parsed.data, req.user.id),
    });

    res.status(201).json(shapeSkill(skill));
  } catch (err) {
    console.error("POST /skills ERROR:", err);

    res.status(500).json({
      error: "Failed to create skill",
    });
  }
});

app.put("/skills/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const parsed = skillSchema.safeParse(req.body);

    if (!parsed.success) {
      return sendValidationError(res, parsed.error);
    }

    const existing = await prisma.skill.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        error: "Skill not found",
      });
    }

    if (existing.userId !== req.user.id) {
      return res.status(403).json({
        error: "Forbidden",
      });
    }

    const data = buildSkillData(parsed.data, req.user.id);

    delete data.userId;

    const skill = await prisma.skill.update({
      where: { id },
      data,
    });

    res.json(shapeSkill(skill));
  } catch (err) {
    console.error("PUT /skills/:id ERROR:", err);

    res.status(500).json({
      error: "Failed to update skill",
    });
  }
});

app.delete("/skills/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const existing = await prisma.skill.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        error: "Skill not found",
      });
    }

    if (existing.userId !== req.user.id) {
      return res.status(403).json({
        error: "Forbidden",
      });
    }

    await prisma.skill.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (err) {
    console.error("DELETE /skills/:id ERROR:", err);

    res.status(500).json({
      error: "Failed to delete skill",
    });
  }
});

// ==========================
// SEARCH
// ==========================

app.get("/search", async (req, res) => {
  try {
    const q = (req.query.q || "")
      .toString()
      .trim();

    const where = q
      ? {
          OR: [
            { name: { contains: q } },
            { username: { contains: q } },
            { email: { contains: q } },

            {
              skills: {
                some: {
                  name: { contains: q },
                },
              },
            },

            {
              skills: {
                some: {
                  category: { contains: q },
                },
              },
            },

            {
              skills: {
                some: {
                  subCategory: { contains: q },
                },
              },
            },
          ],
        }
      : {};

    const users = await prisma.user.findMany({
      where,

      include: {
        skills: true,
      },

      take: 100,

      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(users.map(shapeUser));
  } catch (err) {
    console.error("GET /search ERROR:", err);

    res.status(500).json({
      error: "Search failed",
    });
  }
});

// ==========================
// MESSAGES
// ==========================

// SEND MESSAGE
app.post("/messages", authMiddleware, async (req, res) => {
  try {
    const parsed = messageSchema.safeParse(req.body);

    if (!parsed.success) {
      return sendValidationError(res, parsed.error);
    }

    if (parsed.data.receiverId === req.user.id) {
      return res.status(400).json({
        error: "Cannot message yourself",
      });
    }

    const receiver = await prisma.user.findUnique({
      where: {
        id: parsed.data.receiverId,
      },
    });

    if (!receiver) {
      return res.status(404).json({
        error: "Receiver not found",
      });
    }

    const message = await prisma.message.create({
      data: {
        content: parsed.data.content || "",
        mediaUrl: parsed.data.mediaUrl || null,
        mediaType: parsed.data.mediaType || null,
        senderId: req.user.id,
        receiverId: parsed.data.receiverId,
      },
    });

    res.status(201).json(message);
  } catch (err) {
    console.error("POST /messages ERROR:", err);

    res.status(500).json({
      error: "Failed to send message",
    });
  }
});

// GET CHAT MESSAGES
app.get("/messages/:userId", authMiddleware, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: req.user.id,
            receiverId: userId,
          },

          {
            senderId: userId,
            receiverId: req.user.id,
          },
        ],
      },

      orderBy: {
        createdAt: "asc",
      },
    });

    res.json(messages);
  } catch (err) {
    console.error("GET /messages/:userId ERROR:", err);

    res.status(500).json({
      error: "Failed to load messages",
    });
  }
});

// REACT TO MESSAGE
app.patch("/messages/:messageId/reaction", authMiddleware, async (req, res) => {
  try {
    const messageId = parseInt(req.params.messageId);
    const parsed = reactionSchema.safeParse(req.body);

    if (!parsed.success) {
      return sendValidationError(res, parsed.error);
    }

    const message = await prisma.message.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!message) {
      return res.status(404).json({
        error: "Message not found",
      });
    }

    const inConversation =
      message.senderId === req.user.id || message.receiverId === req.user.id;

    if (!inConversation) {
      return res.status(403).json({
        error: "Forbidden",
      });
    }

    const updated = await prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        reaction: parsed.data.reaction || null,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error("MESSAGE REACTION ERROR:", err);

    res.status(500).json({
      error: "Failed to update reaction",
    });
  }
});

// UNSEND MESSAGE
app.delete("/messages/:messageId", authMiddleware, async (req, res) => {
  try {
    const messageId = parseInt(req.params.messageId);

    const message = await prisma.message.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!message) {
      return res.status(404).json({
        error: "Message not found",
      });
    }

    if (message.senderId !== req.user.id) {
      return res.status(403).json({
        error: "Forbidden",
      });
    }

    await prisma.message.delete({
      where: {
        id: messageId,
      },
    });

    res.json({
      success: true,
    });
  } catch (err) {
    console.error("DELETE MESSAGE ERROR:", err);

    res.status(500).json({
      error: "Failed to unsend message",
    });
  }
});

// LIST CHATS
app.get("/chats", authMiddleware, async (req, res) => {
  try {
    const me = req.user.id;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: me },
          { receiverId: me },
        ],
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            profilePicture: true,
          },
        },

        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
            profilePicture: true,
          },
        },
      },
    });

    const seen = new Map();

    for (const msg of messages) {
      const partner =
        msg.senderId === me
          ? msg.receiver
          : msg.sender;

      if (!seen.has(partner.id)) {
        seen.set(partner.id, {
          partnerId: partner.id,
          fullName: partner.name,
          username: partner.username || "",
          profilePicture: partner.profilePicture || "",
          lastMessage:
            msg.content ||
            (msg.mediaType === "video" ? "Sent a video" : "Sent a photo"),
          timestamp: msg.createdAt,
          unread: 0,
        });
      }
    }

    res.json(Array.from(seen.values()));
  } catch (err) {
    console.error("GET /chats ERROR:", err);

    res.status(500).json({
      error: "Failed to load chats",
    });
  }
});

// ==========================
// POSTS
// ==========================

// CREATE POST
app.post("/posts", authMiddleware, async (req, res) => {
  try {
    const {
      caption,
      imageUrl,
      videoUrl,
    } = req.body;

    if (!caption?.trim() && !imageUrl && !videoUrl) {
      return res.status(400).json({
        error: "Caption, image, or video required",
      });
    }

    const post = await prisma.post.create({
      data: {
        caption: caption || "",
        imageUrl: imageUrl || null,
        videoUrl: videoUrl || null,
        userId: req.user.id,
      },
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("POST /posts ERROR:", err);

    res.status(500).json({
      error: "Failed to create post",
    });
  }
});

// GET FEED
app.get("/posts", authMiddleware, async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            profilePicture: true,
          },
        },

        likes: true,

        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                profilePicture: true,
              },
            },
          },

          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    const formatted = posts.map((post) => ({
      ...post,

      likesCount: post.likes.length,

      commentsCount: post.comments.length,

      likedByMe: post.likes.some(
        (like) => like.userId === req.user.id
      ),
    }));

    res.json(formatted);
  } catch (err) {
    console.error("GET /posts ERROR:", err);

    res.status(500).json({
      error: "Failed to load posts",
    });
  }
});

// DELETE POST
app.delete("/posts/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({
        error: "Post not found",
      });
    }

    if (post.userId !== req.user.id) {
      return res.status(403).json({
        error: "Forbidden",
      });
    }

    await prisma.post.delete({
      where: { id },
    });

    res.json({
      success: true,
    });
  } catch (err) {
    console.error("DELETE POST ERROR:", err);

    res.status(500).json({
      error: "Failed to delete post",
    });
  }
});

// ==========================
// LIKE SYSTEM
// ==========================

app.post("/posts/:id/like", authMiddleware, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);

    const existing = await prisma.like.findFirst({
      where: {
        postId,
        userId: req.user.id,
      },
    });

    if (existing) {
      await prisma.like.delete({
        where: {
          id: existing.id,
        },
      });

      return res.json({
        liked: false,
      });
    }

    await prisma.like.create({
      data: {
        postId,
        userId: req.user.id,
      },
    });

    res.json({
      liked: true,
    });
  } catch (err) {
    console.error("LIKE ERROR:", err);

    res.status(500).json({
      error: "Failed to like post",
    });
  }
});

// ==========================
// COMMENTS
// ==========================

app.post("/posts/:id/comments", authMiddleware, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);

    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        error: "Comment required",
      });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId: req.user.id,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            profilePicture: true,
          },
        },
      },
    });

    res.status(201).json(comment);
  } catch (err) {
    console.error("COMMENT ERROR:", err);

    res.status(500).json({
      error: "Failed to add comment",
    });
  }
});

// DELETE COMMENT
app.delete("/comments/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return res.status(404).json({
        error: "Comment not found",
      });
    }

    if (comment.userId !== req.user.id) {
      return res.status(403).json({
        error: "Forbidden",
      });
    }

    await prisma.comment.delete({
      where: { id },
    });

    res.json({
      success: true,
    });
  } catch (err) {
    console.error("DELETE COMMENT ERROR:", err);

    res.status(500).json({
      error: "Failed to delete comment",
    });
  }
});

// ==========================
// FOLLOW SYSTEM
// ==========================

app.post("/follow/:userId", authMiddleware, async (req, res) => {
  try {
    const followingId = parseInt(req.params.userId);

    if (followingId === req.user.id) {
      return res.status(400).json({
        error: "Cannot follow yourself",
      });
    }

    const existing = await prisma.follow.findFirst({
      where: {
        followerId: req.user.id,
        followingId,
      },
    });

    if (existing) {
      await prisma.follow.delete({
        where: {
          id: existing.id,
        },
      });

      return res.json({
        following: false,
      });
    }

    await prisma.follow.create({
      data: {
        followerId: req.user.id,
        followingId,
      },
    });

    res.json({
      following: true,
    });
  } catch (err) {
    console.error("FOLLOW ERROR:", err);

    res.status(500).json({
      error: "Failed to follow user",
    });
  }
});

// ==========================
// 404 + ERROR
// ==========================

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

app.use((err, _req, res, _next) => {
  console.error("UNHANDLED:", err);

  res.status(500).json({
    error: "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
