import type { DashboardProtocol } from "@/data/protocols/db/dashboard-protocol";
import type { DashboardStats } from "@/domain/models/dashboard";
import type { GetDashboard } from "@/domain/usecases/get-dashboard";

export class GetDashboardUseCase implements GetDashboard {
	constructor(private readonly service: DashboardProtocol) {}

	async execute(): Promise<DashboardStats> {
		return this.service.getStats();
	}
}
