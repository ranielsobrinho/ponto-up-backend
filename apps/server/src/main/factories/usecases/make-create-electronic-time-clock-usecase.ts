import { CreateElectronicTimeClockUseCase } from "@/data/usecases/electronic-time-clock/create-electronic-time-clock-usecase";
import { ElectronicTimeClockService } from "@/infra/db/electronic-time-clock-service";

export function makeCreateElectronicTimeClockUseCase() {
	const service = new ElectronicTimeClockService();
	return new CreateElectronicTimeClockUseCase(service);
}
