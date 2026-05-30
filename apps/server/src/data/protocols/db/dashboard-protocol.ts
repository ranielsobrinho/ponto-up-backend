import type {
	DashboardStats,
	GetDashboardParams,
} from "@/domain/models/dashboard";

export interface DashboardProtocol {
	getStats(params: GetDashboardParams): Promise<DashboardStats>;
}
