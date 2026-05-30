import { createDb } from "@ponto-up-backend/db";
import * as authSchema from "@ponto-up-backend/db/schema/auth";
import * as clockSchema from "@ponto-up-backend/db/schema/electronic-time-clock";
import { and, eq, sql } from "drizzle-orm";
import type { DashboardProtocol } from "@/data/protocols/db/dashboard-protocol";
import type {
	DashboardStats,
	GetDashboardParams,
	LatestRegistryEntry,
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

	async getStats(params: GetDashboardParams): Promise<DashboardStats> {
		const { requestingUserId, isAdmin } = params;

		const [
			activeWorkers,
			clockedInToday,
			lateClockInsPerMonth,
			overtimeHoursCurrentMonth,
			overtimeSummary,
			avgHoursPerDay,
			weeklyPresence,
			extraHoursLast5Months,
			latestRegistries,
		] = await Promise.all([
			this.getActiveWorkers(isAdmin ? null : requestingUserId),
			this.getClockedInToday(isAdmin ? null : requestingUserId),
			this.getLateClockInsPerMonth(isAdmin ? null : requestingUserId),
			this.getOvertimeHoursCurrentMonth(isAdmin ? null : requestingUserId),
			this.getOvertimeSummary(isAdmin ? null : requestingUserId),
			this.getAvgHoursPerDay(isAdmin ? null : requestingUserId),
			this.getWeeklyPresence(isAdmin ? null : requestingUserId),
			this.getExtraHoursLast5Months(isAdmin ? null : requestingUserId),
			this.getLatestRegistries(isAdmin ? null : requestingUserId),
		]);

		return {
			activeWorkers,
			clockedInToday,
			notClockedInToday: activeWorkers - clockedInToday,
			lateClockInsPerMonth,
			overtimeHoursCurrentMonth,
			overtimeSummary,
			avgHoursPerDay,
			weeklyPresence,
			extraHoursLast5Months,
			latestRegistries,
		};
	}

	private makeUserFilter(userId: string | null) {
		if (!userId) return undefined;
		return eq(clockSchema.electronicTimeClock.createdBy, userId);
	}

	private async getActiveWorkers(userId: string | null): Promise<number> {
		if (userId) return 1;

		const [result] = await this.db
			.select({ count: sql<number>`count(*)` })
			.from(authSchema.user)
			.where(eq(authSchema.user.role, "user"));

		return Number(result?.count ?? 0);
	}

	private async getClockedInToday(userId: string | null): Promise<number> {
		const filters: any[] = [
			sql`${clockSchema.electronicTimeClock.clockIn}::date = current_date`,
		];
		const userFilter = this.makeUserFilter(userId);
		if (userFilter) filters.push(userFilter);

		const [result] = await this.db
			.select({
				count: sql<number>`count(distinct ${clockSchema.electronicTimeClock.createdBy})`,
			})
			.from(clockSchema.electronicTimeClock)
			.where(and(...filters));

		return Number(result?.count ?? 0);
	}

	private async getLateClockInsPerMonth(
		userId: string | null,
	): Promise<number> {
		const filters: any[] = [
			sql`${clockSchema.electronicTimeClock.clockIn}::time > '08:00:00'`,
			sql`${clockSchema.electronicTimeClock.clockIn} >= date_trunc('month', current_date)`,
		];
		const userFilter = this.makeUserFilter(userId);
		if (userFilter) filters.push(userFilter);

		const [result] = await this.db
			.select({
				count: sql<number>`count(*)`,
			})
			.from(clockSchema.electronicTimeClock)
			.where(and(...filters));

		return Number(result?.count ?? 0);
	}

	private async getOvertimeHoursCurrentMonth(
		userId: string | null,
	): Promise<number> {
		const userFilter = this.makeUserFilter(userId);

		const weekdayFilters: any[] = [
			sql`${clockSchema.electronicTimeClock.clockIn} >= date_trunc('month', current_date)`,
			sql`extract(dow from ${clockSchema.electronicTimeClock.clockOut}) between 1 and 5`,
			sql`${clockSchema.electronicTimeClock.clockOut}::time > '17:00:00'`,
		];
		if (userFilter) weekdayFilters.push(userFilter);

		const [weekdayResult] = await this.db
			.select({
				hours: sql<number>`coalesce(sum(extract(epoch from (${clockSchema.electronicTimeClock.clockOut} - date_trunc('day', ${clockSchema.electronicTimeClock.clockOut}) - interval '17 hours')) / 3600), 0)`,
			})
			.from(clockSchema.electronicTimeClock)
			.where(and(...weekdayFilters));

		const saturdayFilters: any[] = [
			sql`${clockSchema.electronicTimeClock.clockIn} >= date_trunc('month', current_date)`,
			sql`extract(dow from ${clockSchema.electronicTimeClock.clockIn}) = 6`,
			sql`${clockSchema.electronicTimeClock.clockOut}::time > '12:00:00'`,
		];
		if (userFilter) saturdayFilters.push(userFilter);

		const [saturdayResult] = await this.db
			.select({
				hours: sql<number>`coalesce(sum(greatest(extract(epoch from (${clockSchema.electronicTimeClock.clockOut} - greatest(${clockSchema.electronicTimeClock.clockIn}, date_trunc('day', ${clockSchema.electronicTimeClock.clockIn}) + interval '12 hours'))) / 3600, 0)), 0)`,
			})
			.from(clockSchema.electronicTimeClock)
			.where(and(...saturdayFilters));

		const weekday = Number(weekdayResult?.hours ?? 0);
		const saturday = Number(saturdayResult?.hours ?? 0);

		return Math.round((weekday + saturday) * 100) / 100;
	}

	private async getOvertimeSummary(userId: string | null): Promise<{
		totalOvertimeHours: number;
		weekdayAfter17Hours: number;
		saturdayHours: number;
	}> {
		const userFilter = this.makeUserFilter(userId);

		const weekdayFilters: any[] = [
			sql`extract(dow from ${clockSchema.electronicTimeClock.clockOut}) between 1 and 5`,
			sql`${clockSchema.electronicTimeClock.clockOut}::time > '17:00:00'`,
		];
		if (userFilter) weekdayFilters.push(userFilter);

		const [weekdayResult] = await this.db
			.select({
				hours: sql<number>`coalesce(sum(extract(epoch from (${clockSchema.electronicTimeClock.clockOut} - date_trunc('day', ${clockSchema.electronicTimeClock.clockOut}) - interval '17 hours')) / 3600), 0)`,
			})
			.from(clockSchema.electronicTimeClock)
			.where(and(...weekdayFilters));

		const saturdayFilters: any[] = [
			sql`extract(dow from ${clockSchema.electronicTimeClock.clockIn}) = 6`,
		];
		if (userFilter) saturdayFilters.push(userFilter);

		const [saturdayResult] = await this.db
			.select({
				hours: sql<number>`coalesce(sum(extract(epoch from (${clockSchema.electronicTimeClock.clockOut} - ${clockSchema.electronicTimeClock.clockIn})) / 3600), 0)`,
			})
			.from(clockSchema.electronicTimeClock)
			.where(and(...saturdayFilters));

		const weekday = Number(weekdayResult?.hours ?? 0);
		const saturday = Number(saturdayResult?.hours ?? 0);

		return {
			totalOvertimeHours: Math.round((weekday + saturday) * 100) / 100,
			weekdayAfter17Hours: Math.round(weekday * 100) / 100,
			saturdayHours: Math.round(saturday * 100) / 100,
		};
	}

	private async getAvgHoursPerDay(userId: string | null): Promise<number> {
		const userFilter = this.makeUserFilter(userId);
		const filters = userFilter ? [userFilter] : [];

		const [result] = await this.db
			.select({
				avg: sql<number>`coalesce(avg(extract(epoch from (${clockSchema.electronicTimeClock.clockOut} - ${clockSchema.electronicTimeClock.clockIn})) / 3600), 0)`,
			})
			.from(clockSchema.electronicTimeClock)
			.where(filters.length > 0 ? and(...filters) : undefined);

		return Math.round(Number(result?.avg ?? 0) * 100) / 100;
	}

	private async getWeeklyPresence(
		userId: string | null,
	): Promise<WeeklyPresenceEntry[]> {
		const userFilter = this.makeUserFilter(userId);

		const filters: any[] = [
			sql`${clockSchema.electronicTimeClock.clockIn} >= date_trunc('week', current_date)`,
			sql`${clockSchema.electronicTimeClock.clockIn} < date_trunc('week', current_date) + interval '7 days'`,
		];
		if (userFilter) filters.push(userFilter);

		const results = await this.db
			.select({
				dayOfWeek: sql<number>`extract(dow from ${clockSchema.electronicTimeClock.clockIn})`,
				users: sql<number>`count(distinct ${clockSchema.electronicTimeClock.createdBy})`,
			})
			.from(clockSchema.electronicTimeClock)
			.where(and(...filters))
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

	private generateLastMonths(count: number): string[] {
		const months: string[] = [];
		const now = new Date();
		for (let i = count - 1; i >= 0; i--) {
			const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
			const y = d.getFullYear();
			const m = String(d.getMonth() + 1).padStart(2, "0");
			months.push(`${y}-${m}-01`);
		}
		return months;
	}

	private async getExtraHoursLast5Months(
		userId: string | null,
	): Promise<MonthlyHours[]> {
		const userFilter = this.makeUserFilter(userId);

		const filters: any[] = [
			sql`${clockSchema.electronicTimeClock.clockIn} >= date_trunc('month', current_date - interval '5 months')`,
			sql`extract(dow from ${clockSchema.electronicTimeClock.clockOut}) between 1 and 5`,
			sql`${clockSchema.electronicTimeClock.clockOut}::time > '17:00:00'`,
		];
		if (userFilter) filters.push(userFilter);

		const results = await this.db
			.select({
				month: sql<string>`date_trunc('month', ${clockSchema.electronicTimeClock.clockIn})::date`,
				hours: sql<number>`coalesce(sum(extract(epoch from (${clockSchema.electronicTimeClock.clockOut} - date_trunc('day', ${clockSchema.electronicTimeClock.clockOut}) - interval '17 hours')) / 3600), 0)`,
			})
			.from(clockSchema.electronicTimeClock)
			.where(and(...filters))
			.groupBy(
				sql`date_trunc('month', ${clockSchema.electronicTimeClock.clockIn})`,
			)
			.orderBy(
				sql`date_trunc('month', ${clockSchema.electronicTimeClock.clockIn})`,
			);

		const resultMap = new Map<string, number>(
			results.map((r) => [r.month, Number(r.hours)]),
		);

		const monthList = this.generateLastMonths(5);

		return monthList.map((month) => ({
			month,
			hours: Math.round((resultMap.get(month) ?? 0) * 100) / 100,
		}));
	}

	private async getLatestRegistries(
		userId: string | null,
	): Promise<LatestRegistryEntry[]> {
		const userFilter = this.makeUserFilter(userId);
		const filters = userFilter ? [userFilter] : [];

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
			.where(filters.length > 0 ? and(...filters) : undefined)
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
