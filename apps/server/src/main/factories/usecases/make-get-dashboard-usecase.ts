import { GetDashboardUseCase } from "@/data/usecases/dashboard/get-dashboard-usecase";
import { DashboardService } from "@/infra/db/dashboard-service";

export function makeGetDashboardUseCase() {
	const service = new DashboardService();
	return new GetDashboardUseCase(service);
}
