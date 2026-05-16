import type {
	ElectronicTimeClockModel,
	UpdateElectronicTimeClockParams,
} from "@/domain/models/electronic-time-clock";

export interface UpdateElectronicTimeClock {
	execute(
		id: number,
		params: UpdateElectronicTimeClockParams,
	): Promise<ElectronicTimeClockModel>;
}
