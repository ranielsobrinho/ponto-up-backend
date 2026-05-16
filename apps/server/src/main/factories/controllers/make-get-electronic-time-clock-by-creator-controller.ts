import { makeGetElectronicTimeClockByCreatorUseCase } from "@/main/factories/usecases/make-get-electronic-time-clock-by-creator-usecase";
import { GetElectronicTimeClockByCreatorController } from "@/presentation/controllers/electronic-time-clock/get-electronic-time-clock-by-creator-controller";

export function makeGetElectronicTimeClockByCreatorController() {
	const useCase = makeGetElectronicTimeClockByCreatorUseCase();
	return new GetElectronicTimeClockByCreatorController(useCase);
}
