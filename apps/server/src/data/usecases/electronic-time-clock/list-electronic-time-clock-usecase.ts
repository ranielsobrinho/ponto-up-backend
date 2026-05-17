import type { ElectronicTimeClockProtocol } from "@/data/protocols/db/electronic-time-clock-protocol";
import type { ElectronicTimeClockModel } from "@/domain/models/electronic-time-clock";
import type {
	ListElectronicTimeClock,
	ListElectronicTimeClockParams,
} from "@/domain/usecases/list-electronic-time-clock";

export class ListElectronicTimeClockUseCase implements ListElectronicTimeClock {
	constructor(private readonly service: ElectronicTimeClockProtocol) {}

	async execute(
		params: ListElectronicTimeClockParams,
	): Promise<ElectronicTimeClockModel[]> {
		return this.service.list(params);
	}
}
