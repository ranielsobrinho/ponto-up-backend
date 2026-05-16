import { makeCreateElectronicTimeClockUseCase } from "@/main/factories/usecases/make-create-electronic-time-clock-usecase";
import { CreateElectronicTimeClockController } from "@/presentation/controllers/electronic-time-clock/create-electronic-time-clock-controller";

export function makeCreateElectronicTimeClockController() {
	const useCase = makeCreateElectronicTimeClockUseCase();
	return new CreateElectronicTimeClockController(useCase);
}
