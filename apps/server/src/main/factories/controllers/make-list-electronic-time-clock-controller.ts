import { makeListElectronicTimeClockUseCase } from "@/main/factories/usecases/make-list-electronic-time-clock-usecase";
import { ListElectronicTimeClockController } from "@/presentation/controllers/electronic-time-clock/list-electronic-time-clock-controller";

export function makeListElectronicTimeClockController() {
	const useCase = makeListElectronicTimeClockUseCase();
	return new ListElectronicTimeClockController(useCase);
}
