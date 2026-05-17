import { z } from "zod";

export const updateUserSchema = z.object({
	name: z.string().min(1, "Name is required").optional(),
	email: z.string().email("Invalid email format").optional(),
	image: z.string().url("Invalid image URL").optional().nullable(),
	role: z.enum(["admin", "user"]).optional(),
});

export const updateUserPasswordSchema = z.object({
	newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export type UpdateUserPasswordInput = z.infer<typeof updateUserPasswordSchema>;
