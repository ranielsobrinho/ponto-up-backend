import type { DashboardProtocol } from "@/data/protocols/db/dashboard-protocol";
import type {
	DashboardStats,
	GetDashboardParams,
} from "@/domain/models/dashboard";
import type { GetDashboard } from "@/domain/usecases/get-dashboard";

export class GetDashboardUseCase implements GetDashboard {
	constructor(private readonly service: DashboardProtocol) {}

	async execute(params: GetDashboardParams): Promise<DashboardStats> {
		return this.service.getStats(params);
	}
}
