import type { ElectronicTimeClockProtocol } from "@/data/protocols/db/electronic-time-clock-protocol";
import type {
	ElectronicTimeClockModel,
	UpdateElectronicTimeClockParams,
} from "@/domain/models/electronic-time-clock";
import type { UpdateElectronicTimeClock } from "@/domain/usecases/update-electronic-time-clock";

export class UpdateElectronicTimeClockUseCase
	implements UpdateElectronicTimeClock
{
	constructor(private readonly service: ElectronicTimeClockProtocol) {}

	async execute(
		id: number,
		params: UpdateElectronicTimeClockParams,
	): Promise<ElectronicTimeClockModel> {
		return this.service.update(id, params);
	}
}
