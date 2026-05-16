import { z } from "zod";

const isoDateTimeRegex =
	/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(([+-]\d{2}:\d{2})|Z)?$/i;

export const createElectronicTimeClockSchema = z.object({
	title: z.string().min(1, "Title is required"),
	clockIn: z.string().refine((val) => isoDateTimeRegex.test(val), {
		message:
			"Invalid clock in date. Use ISO 8601 format (e.g., 2025-05-16T08:00:00Z)",
	}),
	clockOut: z.string().refine((val) => isoDateTimeRegex.test(val), {
		message:
			"Invalid clock out date. Use ISO 8601 format (e.g., 2025-05-16T17:00:00Z)",
	}),
	observations: z.string().optional(),
});

export const updateElectronicTimeClockSchema = z.object({
	title: z.string().min(1, "Title is required").optional(),
	clockIn: z
		.string()
		.refine((val) => isoDateTimeRegex.test(val), {
			message:
				"Invalid clock in date. Use ISO 8601 format (e.g., 2025-05-16T08:00:00Z)",
		})
		.optional(),
	clockOut: z
		.string()
		.refine((val) => isoDateTimeRegex.test(val), {
			message:
				"Invalid clock out date. Use ISO 8601 format (e.g., 2025-05-16T17:00:00Z)",
		})
		.optional(),
	observations: z.string().optional(),
});

export type CreateElectronicTimeClockInput = z.infer<
	typeof createElectronicTimeClockSchema
>;

export type UpdateElectronicTimeClockInput = z.infer<
	typeof updateElectronicTimeClockSchema
>;
