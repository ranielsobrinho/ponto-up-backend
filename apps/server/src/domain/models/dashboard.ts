export type LatestRegistryEntry = {
	id: number;
	title: string;
	clockIn: Date;
	clockOut: Date;
	observations: string | null;
	createdAt: Date;
	createdBy: string;
	userName: string;
	userEmail: string;
};

export type MonthlyHours = {
	month: string;
	hours: number;
};

export type OvertimeSummary = {
	totalOvertimeHours: number;
	weekdayAfter17Hours: number;
	saturdayHours: number;
};

export type WeeklyPresenceEntry = {
	dayOfWeek: number;
	dayName: string;
	users: number;
};

export type GetDashboardParams = {
	requestingUserId: string;
	isAdmin: boolean;
};

export type DashboardStats = {
	activeWorkers: number;
	clockedInToday: number;
	notClockedInToday: number;
	lateClockInsPerMonth: number;
	overtimeHoursCurrentMonth: number;
	overtimeSummary: OvertimeSummary;
	avgHoursPerDay: number;
	weeklyPresence: WeeklyPresenceEntry[];
	extraHoursLast5Months: MonthlyHours[];
	latestRegistries: LatestRegistryEntry[];
};
