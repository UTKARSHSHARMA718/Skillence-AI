import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(6, "Minimum 6 characters"),
  profile: z.string().min(1, "Profile is required")
});

export type LoginFormValues = z.infer<typeof loginSchema>;
