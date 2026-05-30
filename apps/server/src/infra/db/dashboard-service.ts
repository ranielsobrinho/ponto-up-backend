import { createDb } from "@ponto-up-backend/db";
import * as authSchema from "@ponto-up-backend/db/schema/auth";
import * as clockSchema from "@ponto-up-backend/db/schema/electronic-time-clock";
import { and, eq, sql } from "drizzle-orm";
import type { DashboardProtocol } from "@/data/protocols/db/dashboard-protocol";
import type {
	DashboardStats,
	LatestRegistryEntry,
	MonthlyCount,
	MonthlyHours,
	WeeklyPresenceEntry,
} from "@/domain/models/dashboard";

const DAY_NAMES = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

export class DashboardService implements DashboardProtocol {
	private db = createDb();

	async getStats(): Promise<DashboardStats> {
		const [
			activeWorkers,
			clockedInToday,
			lateClockInsPerMonth,
			overtimeSummary,
			avgHoursPerDay,
			weeklyPresence,
			extraHoursLast5Months,
			latestRegistries,
		] = await Promise.all([
			this.getActiveWorkers(),
			this.getClockedInToday(),
			this.getLateClockInsPerMonth(),
			this.getOvertimeSummary(),
			this.getAvgHoursPerDay(),
			this.getWeeklyPresence(),
			this.getExtraHoursLast5Months(),
			this.getLatestRegistries(),
		]);

		return {
			activeWorkers,
			clockedInToday,
			notClockedInToday: activeWorkers - clockedInToday,
			lateClockInsPerMonth,
			overtimeSummary,
			avgHoursPerDay,
			weeklyPresence,
			extraHoursLast5Months,
			latestRegistries,
		};
	}

	private async getActiveWorkers(): Promise<number> {
		const [result] = await this.db
			.select({ count: sql<number>`count(*)` })
			.from(authSchema.user)
			.where(eq(authSchema.user.role, "user"));

		return Number(result?.count ?? 0);
	}

	private async getClockedInToday(): Promise<number> {
		const [result] = await this.db
			.select({
				count: sql<number>`count(distinct ${clockSchema.electronicTimeClock.createdBy})`,
			})
			.from(clockSchema.electronicTimeClock)
			.where(
				sql`${clockSchema.electronicTimeClock.clockIn}::date = current_date`,
			);

		return Number(result?.count ?? 0);
	}

	private async getLateClockInsPerMonth(): Promise<MonthlyCount[]> {
		const results = await this.db
			.select({
				month: sql<string>`date_trunc('month', ${clockSchema.electronicTimeClock.clockIn})::date`,
				count: sql<number>`count(*)`,
			})
			.from(clockSchema.electronicTimeClock)
			.where(sql`${clockSchema.electronicTimeClock.clockIn}::time > '08:00:00'`)
			.groupBy(
				sql`date_trunc('month', ${clockSchema.electronicTimeClock.clockIn})`,
			)
			.orderBy(
				sql`date_trunc('month', ${clockSchema.electronicTimeClock.clockIn}) desc`,
			);

		return results.map((r) => ({
			month: r.month,
			count: Number(r.count),
		}));
	}

	private async getOvertimeSummary(): Promise<{
		totalOvertimeHours: number;
		weekdayAfter17Hours: number;
		saturdayHours: number;
	}> {
		const [weekdayResult] = await this.db
			.select({
				hours: sql<number>`coalesce(sum(extract(epoch from (${clockSchema.electronicTimeClock.clockOut} - date_trunc('day', ${clockSchema.electronicTimeClock.clockOut}) - interval '17 hours')) / 3600), 0)`,
			})
			.from(clockSchema.electronicTimeClock)
			.where(
				and(
					sql`extract(dow from ${clockSchema.electronicTimeClock.clockOut}) between 1 and 5`,
					sql`${clockSchema.electronicTimeClock.clockOut}::time > '17:00:00'`,
				),
			);

		const [saturdayResult] = await this.db
			.select({
				hours: sql<number>`coalesce(sum(extract(epoch from (${clockSchema.electronicTimeClock.clockOut} - ${clockSchema.electronicTimeClock.clockIn})) / 3600), 0)`,
			})
			.from(clockSchema.electronicTimeClock)
			.where(
				sql`extract(dow from ${clockSchema.electronicTimeClock.clockIn}) = 6`,
			);

		const weekday = Number(weekdayResult?.hours ?? 0);
		const saturday = Number(saturdayResult?.hours ?? 0);

		return {
			totalOvertimeHours: Math.round((weekday + saturday) * 100) / 100,
			weekdayAfter17Hours: Math.round(weekday * 100) / 100,
			saturdayHours: Math.round(saturday * 100) / 100,
		};
	}

	private async getAvgHoursPerDay(): Promise<number> {
		const [result] = await this.db
			.select({
				avg: sql<number>`coalesce(avg(extract(epoch from (${clockSchema.electronicTimeClock.clockOut} - ${clockSchema.electronicTimeClock.clockIn})) / 3600), 0)`,
			})
			.from(clockSchema.electronicTimeClock);

		return Math.round(Number(result?.avg ?? 0) * 100) / 100;
	}

	private async getWeeklyPresence(): Promise<WeeklyPresenceEntry[]> {
		const results = await this.db
			.select({
				dayOfWeek: sql<number>`extract(dow from ${clockSchema.electronicTimeClock.clockIn})`,
				users: sql<number>`count(distinct ${clockSchema.electronicTimeClock.createdBy})`,
			})
			.from(clockSchema.electronicTimeClock)
			.where(
				and(
					sql`${clockSchema.electronicTimeClock.clockIn} >= date_trunc('week', current_date)`,
					sql`${clockSchema.electronicTimeClock.clockIn} < date_trunc('week', current_date) + interval '7 days'`,
				),
			)
			.groupBy(
				sql`extract(dow from ${clockSchema.electronicTimeClock.clockIn})`,
			)
			.orderBy(
				sql`extract(dow from ${clockSchema.electronicTimeClock.clockIn})`,
			);

		return results.map((r) => ({
			dayOfWeek: Number(r.dayOfWeek),
			dayName: DAY_NAMES[Number(r.dayOfWeek)] ?? "Unknown",
			users: Number(r.users),
		}));
	}

	private async getExtraHoursLast5Months(): Promise<MonthlyHours[]> {
		const results = await this.db
			.select({
				month: sql<string>`date_trunc('month', ${clockSchema.electronicTimeClock.clockIn})::date`,
				hours: sql<number>`coalesce(sum(extract(epoch from (${clockSchema.electronicTimeClock.clockOut} - date_trunc('day', ${clockSchema.electronicTimeClock.clockOut}) - interval '17 hours')) / 3600), 0)`,
			})
			.from(clockSchema.electronicTimeClock)
			.where(
				and(
					sql`${clockSchema.electronicTimeClock.clockIn} >= date_trunc('month', current_date - interval '5 months')`,
					and(
						sql`extract(dow from ${clockSchema.electronicTimeClock.clockOut}) between 1 and 5`,
						sql`${clockSchema.electronicTimeClock.clockOut}::time > '17:00:00'`,
					),
				),
			)
			.groupBy(
				sql`date_trunc('month', ${clockSchema.electronicTimeClock.clockIn})`,
			)
			.orderBy(
				sql`date_trunc('month', ${clockSchema.electronicTimeClock.clockIn})`,
			);

		return results.map((r) => ({
			month: r.month,
			hours: Math.round(Number(r.hours) * 100) / 100,
		}));
	}

	private async getLatestRegistries(): Promise<LatestRegistryEntry[]> {
		const results = await this.db
			.select({
				id: clockSchema.electronicTimeClock.id,
				title: clockSchema.electronicTimeClock.title,
				clockIn: clockSchema.electronicTimeClock.clockIn,
				clockOut: clockSchema.electronicTimeClock.clockOut,
				observations: clockSchema.electronicTimeClock.observations,
				createdAt: clockSchema.electronicTimeClock.createdAt,
				createdBy: clockSchema.electronicTimeClock.createdBy,
				userName: authSchema.user.name,
				userEmail: authSchema.user.email,
			})
			.from(clockSchema.electronicTimeClock)
			.innerJoin(
				authSchema.user,
				eq(clockSchema.electronicTimeClock.createdBy, authSchema.user.id),
			)
			.orderBy(sql`${clockSchema.electronicTimeClock.createdAt} desc`)
			.limit(20);

		return results.map((r) => ({
			id: r.id,
			title: r.title,
			clockIn: r.clockIn,
			clockOut: r.clockOut,
			observations: r.observations,
			createdAt: r.createdAt,
			createdBy: r.createdBy,
			userName: r.userName,
			userEmail: r.userEmail,
		}));
	}
}
