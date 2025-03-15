import { z } from "zod";
import { usernameValidation } from "./signupSchema.schema";

const UsernameOrEmailSchema = z.union([
  z.string().email("Invalid Email"), // Email validation
  z.string().min(2, "Username must be atleast 2 character"), // Assuming a minimum length for usernames
]);

export const signInSchema = z.object({
  identifier: UsernameOrEmailSchema,
  password: z.string(),
});
