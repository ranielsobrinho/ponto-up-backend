import type { ElectronicTimeClockProtocol } from "@/data/protocols/db/electronic-time-clock-protocol";
import type {
	CreateElectronicTimeClockParams,
	ElectronicTimeClockModel,
} from "@/domain/models/electronic-time-clock";
import type { CreateElectronicTimeClock } from "@/domain/usecases/create-electronic-time-clock";

export class CreateElectronicTimeClockUseCase
	implements CreateElectronicTimeClock
{
	constructor(private readonly service: ElectronicTimeClockProtocol) {}

	async execute(
		params: CreateElectronicTimeClockParams,
	): Promise<ElectronicTimeClockModel> {
		return this.service.create(params);
	}
}
