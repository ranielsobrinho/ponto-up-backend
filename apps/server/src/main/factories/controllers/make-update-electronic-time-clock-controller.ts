import { makeUpdateElectronicTimeClockUseCase } from "@/main/factories/usecases/make-update-electronic-time-clock-usecase";
import { UpdateElectronicTimeClockController } from "@/presentation/controllers/electronic-time-clock/update-electronic-time-clock-controller";

export function makeUpdateElectronicTimeClockController() {
	const useCase = makeUpdateElectronicTimeClockUseCase();
	return new UpdateElectronicTimeClockController(useCase);
}
