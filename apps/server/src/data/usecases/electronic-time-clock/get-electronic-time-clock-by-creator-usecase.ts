import type { ElectronicTimeClockProtocol } from "@/data/protocols/db/electronic-time-clock-protocol";
import type { ElectronicTimeClockModel } from "@/domain/models/electronic-time-clock";
import type { GetElectronicTimeClockByCreator } from "@/domain/usecases/get-electronic-time-clock-by-creator";

export class GetElectronicTimeClockByCreatorUseCase
	implements GetElectronicTimeClockByCreator
{
	constructor(private readonly service: ElectronicTimeClockProtocol) {}

	async execute(creatorId: string): Promise<ElectronicTimeClockModel[]> {
		return this.service.getByCreator(creatorId);
	}
}
