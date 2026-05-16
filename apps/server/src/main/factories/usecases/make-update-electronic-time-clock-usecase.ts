import { UpdateElectronicTimeClockUseCase } from "@/data/usecases/electronic-time-clock/update-electronic-time-clock-usecase";
import { ElectronicTimeClockService } from "@/infra/db/electronic-time-clock-service";

export function makeUpdateElectronicTimeClockUseCase() {
	const service = new ElectronicTimeClockService();
	return new UpdateElectronicTimeClockUseCase(service);
}
