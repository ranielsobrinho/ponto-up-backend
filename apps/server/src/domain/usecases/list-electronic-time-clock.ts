import type { ElectronicTimeClockModel } from "@/domain/models/electronic-time-clock";

export interface ListElectronicTimeClockParams {
	startDate?: Date;
	endDate?: Date;
	userId: string;
}

export interface ListElectronicTimeClock {
	execute(
		params: ListElectronicTimeClockParams,
	): Promise<ElectronicTimeClockModel[]>;
}
