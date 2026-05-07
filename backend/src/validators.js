const { z } = require("zod");

const userCreateSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

const userUpdateSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
});

module.exports = {
  userCreateSchema,
  userUpdateSchema,
};