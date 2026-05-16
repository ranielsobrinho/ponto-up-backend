import { GetElectronicTimeClockByCreatorUseCase } from "@/data/usecases/electronic-time-clock/get-electronic-time-clock-by-creator-usecase";
import { ElectronicTimeClockService } from "@/infra/db/electronic-time-clock-service";

export function makeGetElectronicTimeClockByCreatorUseCase() {
	const service = new ElectronicTimeClockService();
	return new GetElectronicTimeClockByCreatorUseCase(service);
}
