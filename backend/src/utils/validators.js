const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().trim().min(2).max(60),
  email: z.string().trim().email().max(120),
  password: z.string().min(6).max(100),
});

const loginSchema = z.object({
  email: z.string().trim().email().max(120),
  password: z.string().min(1).max(100),
});

const forgotSchema = z.object({ email: z.string().trim().email().max(120) });

const resetSchema = z.object({
  token: z.string().min(20).max(200),
  password: z.string().min(6).max(100),
});

const roleSchema = z.object({
  role: z.enum(["user", "staff", "viewer", "admin"]),
});

const chatSchema = z.object({
  message: z.string().trim().min(1).max(500),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(2000),
      }),
    )
    .max(20)
    .optional()
    .default([]),
});

const addressSchema = z.object({
  label: z.string().trim().max(30).optional().default("Home"),
  name: z.string().trim().min(2).max(60),
  phone: z.string().trim().min(6).max(20),
  city: z.string().trim().min(2).max(60),
  address: z.string().trim().min(5).max(250),
  is_default: z.boolean().optional().default(false),
});

const returnSchema = z.object({
  reason: z.enum(["Damaged", "Wrong item", "Not as described", "Other"]),
  note: z.string().trim().max(500).optional().default(""),
});

const trackSchema = z.object({
  order_id: z.coerce.number().int().positive(),
  phone: z.string().trim().min(6).max(20),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotSchema,
  resetSchema,
  roleSchema,
  chatSchema,
  addressSchema,
  returnSchema,
  trackSchema,
};
