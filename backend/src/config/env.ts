import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url({ message: "DATABASE_URL must be a valid URL" }).transform((url) => url.replace(/\/+$/, "")),

  // JWT
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),

  // Server
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Shopify OAuth
  SHOPIFY_API_KEY: z.string().min(1, "SHOPIFY_API_KEY is required"),
  SHOPIFY_API_SECRET: z.string().min(1, "SHOPIFY_API_SECRET is required"),
  SHOPIFY_SCOPES: z.string().min(1, "SHOPIFY_SCOPES is required"),
  SHOPIFY_REDIRECT_URI: z.string().url({ message: "SHOPIFY_REDIRECT_URI must be a valid URL" }).transform((url) => url.replace(/\/+$/, "")),

  // Webhooks
  WEBHOOK_BASE_URL: z.string().url({ message: "WEBHOOK_BASE_URL must be a valid URL" }).transform((url) => url.replace(/\/+$/, "")),

  // Frontend (optional)
  FRONTEND_URL: z.string().url({ message: "FRONTEND_URL must be a valid URL" }).transform((url) => url.replace(/\/+$/, "")).optional(),

  // Logging (optional)
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).optional(),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues
        .map((err: z.ZodIssue) => {
          const path = err.path.length > 0 ? err.path.join(".") : "root";
          return `${path}: ${err.message}`;
        })
        .join("\n");

      console.error("❌ Invalid environment variables:\n", missingVars);
      console.error("\nPlease check your .env file and ensure all required variables are set.");
      process.exit(1);
    }
    throw error;
  }
}

export const env = validateEnv();
