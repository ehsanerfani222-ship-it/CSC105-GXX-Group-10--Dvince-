const { z } = require("zod");

const registerSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6).max(100),
  name: z.string().trim().min(1).max(100),
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

const profileUpdateSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  username: z.string().trim().max(100).optional(),
  bio: z.string().max(1000).optional(),
  profilePicture: z.string().max(2_000_000).optional(), // base64 ok
  phoneNumber: z.string().max(50).optional(),
  dateOfBirth: z.string().max(50).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
});

const skillSchema = z.object({
  name: z.string().trim().min(1).max(150),
  category: z.string().max(100).optional().nullable(),
  subCategory: z.string().max(100).optional().nullable(),
  experienceLevel: z.string().max(50).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  preferences: z.string().max(2000).optional().nullable(),
  schedule: z
    .object({
      days: z.array(z.string()).optional(),
      timeStart: z.string().optional(),
      timeEnd: z.string().optional(),
    })
    .optional()
    .nullable(),
});

const messageSchema = z
  .object({
    content: z.string().trim().max(5000).optional().default(""),
    mediaUrl: z.string().max(15_000_000).optional().nullable(),
    mediaType: z.enum(["image", "video"]).optional().nullable(),
    receiverId: z.coerce.number().int().positive(),
  })
  .refine((data) => data.content.trim() || data.mediaUrl, {
    message: "Message text or media is required",
    path: ["content"],
  });

const reactionSchema = z.object({
  reaction: z.string().trim().max(16).nullable(),
});

module.exports = {
  registerSchema,
  loginSchema,
  profileUpdateSchema,
  skillSchema,
  messageSchema,
  reactionSchema,
};
