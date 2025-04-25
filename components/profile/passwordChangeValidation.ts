import { z } from "zod";

export const passwordSchema = z.object({
  currentPassword: z
    .string({
      required_error: "Password is required for your safety",
    })
    .max(20, { message: "Password can not be more than 20 characters" }),
  newPassword: z
    .string({
      required_error: "Password is required for your safety",
    })
    .max(20, { message: "Password can not be more than 20 characters" }),
  passwordConfirm: z
    .string({
      required_error: "Password is required for your safety",
    })
    .max(20, { message: "Password can not be more than 20 characters" }),
});
