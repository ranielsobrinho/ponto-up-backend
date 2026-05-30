import type { DashboardStats } from "@/domain/models/dashboard";

export interface GetDashboard {
	execute(): Promise<DashboardStats>;
}
