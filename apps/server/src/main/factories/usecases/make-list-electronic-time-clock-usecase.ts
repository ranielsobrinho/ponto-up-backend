import { ListElectronicTimeClockUseCase } from "@/data/usecases/electronic-time-clock/list-electronic-time-clock-usecase";
import { ElectronicTimeClockService } from "@/infra/db/electronic-time-clock-service";

export function makeListElectronicTimeClockUseCase() {
	const service = new ElectronicTimeClockService();
	return new ListElectronicTimeClockUseCase(service);
}
