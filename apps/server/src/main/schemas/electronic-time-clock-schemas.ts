import { z } from "zod";

export const createElectronicTimeClockSchema = z.object({
	title: z.string().min(1, "Title is required"),
	clockIn: z.string().datetime("Invalid clock in date"),
	clockOut: z.string().datetime("Invalid clock out date"),
	observations: z.string().optional(),
});

export const updateElectronicTimeClockSchema = z.object({
	title: z.string().min(1, "Title is required").optional(),
	clockIn: z.string().datetime("Invalid clock in date").optional(),
	clockOut: z.string().datetime("Invalid clock out date").optional(),
	observations: z.string().optional(),
});

export type CreateElectronicTimeClockInput = z.infer<
	typeof createElectronicTimeClockSchema
>;

export type UpdateElectronicTimeClockInput = z.infer<
	typeof updateElectronicTimeClockSchema
>;
