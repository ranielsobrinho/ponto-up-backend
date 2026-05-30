import { makeGetDashboardUseCase } from "@/main/factories/usecases/make-get-dashboard-usecase";
import { GetDashboardController } from "@/presentation/controllers/dashboard/get-dashboard-controller";

export function makeGetDashboardController() {
	const useCase = makeGetDashboardUseCase();
	return new GetDashboardController(useCase);
}
