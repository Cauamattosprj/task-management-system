import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(4, "Username must have at least 4 characters")
    .nonempty("Username is required"),
  email: z.string().nonempty("Email is required").email("Enter a valid email"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must have at least 8 characters"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
