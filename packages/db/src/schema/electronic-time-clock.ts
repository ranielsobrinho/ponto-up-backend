import { relations } from "drizzle-orm";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const electronicTimeClock = pgTable("electronic_time_clock", {
	id: serial("id").primaryKey(),
	title: text("title").notNull(),
	clockIn: timestamp("clock_in").notNull(),
	clockOut: timestamp("clock_out").notNull(),
	observations: text("observations"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	createdBy: text("created_by")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});

export const electronicTimeClockRelations = relations(
	electronicTimeClock,
	({ one }) => ({
		createdByUser: one(user, {
			fields: [electronicTimeClock.createdBy],
			references: [user.id],
		}),
	}),
);
