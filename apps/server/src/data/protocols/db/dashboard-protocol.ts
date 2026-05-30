import type { DashboardStats } from "@/domain/models/dashboard";

export interface DashboardProtocol {
	getStats(): Promise<DashboardStats>;
}
