import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),

  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),

  NEXT_PUBLIC_VAPI_PUBLIC_KEY: z.string().min(1),

  NEXT_PUBLIC_DOWNLOAD_SPEED_LIMIT: z.coerce.number().default(10),
  NEXT_PUBLIC_UPLOAD_SPEED_LIMIT: z.coerce.number().default(5),
});

// Parse and validate
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsedEnv.error.format());
  throw new Error("Invalid environment variables");
}

export const env = parsedEnv.data;