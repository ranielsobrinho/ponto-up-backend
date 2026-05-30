import type {
	DashboardStats,
	GetDashboardParams,
} from "@/domain/models/dashboard";

export interface GetDashboard {
	execute(params: GetDashboardParams): Promise<DashboardStats>;
}
