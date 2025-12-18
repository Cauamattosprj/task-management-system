import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().nonempty("Email is required").email("Enter a valid email"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must have at least 8 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
