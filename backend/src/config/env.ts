import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL não foi configurada"),

  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET precisa ter pelo menos 32 caracteres"),

  PORT: z.coerce
    .number()
    .int()
    .positive()
    .default(3333),
});

export const env = envSchema.parse(process.env);