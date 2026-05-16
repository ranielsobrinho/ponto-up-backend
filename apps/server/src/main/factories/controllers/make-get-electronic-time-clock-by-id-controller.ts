import { makeGetElectronicTimeClockByIdUseCase } from "@/main/factories/usecases/make-get-electronic-time-clock-by-id-usecase";
import { GetElectronicTimeClockByIdController } from "@/presentation/controllers/electronic-time-clock/get-electronic-time-clock-by-id-controller";

export function makeGetElectronicTimeClockByIdController() {
	const useCase = makeGetElectronicTimeClockByIdUseCase();
	return new GetElectronicTimeClockByIdController(useCase);
}
