import { GetElectronicTimeClockByIdUseCase } from "@/data/usecases/electronic-time-clock/get-electronic-time-clock-by-id-usecase";
import { ElectronicTimeClockService } from "@/infra/db/electronic-time-clock-service";

export function makeGetElectronicTimeClockByIdUseCase() {
	const service = new ElectronicTimeClockService();
	return new GetElectronicTimeClockByIdUseCase(service);
}
