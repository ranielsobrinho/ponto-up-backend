import type { ElectronicTimeClockProtocol } from "@/data/protocols/db/electronic-time-clock-protocol";
import type { ElectronicTimeClockModel } from "@/domain/models/electronic-time-clock";
import type { GetElectronicTimeClockById } from "@/domain/usecases/get-electronic-time-clock-by-id";

export class GetElectronicTimeClockByIdUseCase
	implements GetElectronicTimeClockById
{
	constructor(private readonly service: ElectronicTimeClockProtocol) {}

	async execute(id: number): Promise<ElectronicTimeClockModel | null> {
		return this.service.getById(id);
	}
}
