import type {
	CreateElectronicTimeClockParams,
	ElectronicTimeClockModel,
} from "@/domain/models/electronic-time-clock";

export interface CreateElectronicTimeClock {
	execute(
		params: CreateElectronicTimeClockParams,
	): Promise<ElectronicTimeClockModel>;
}
