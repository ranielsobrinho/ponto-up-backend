import type { ElectronicTimeClockModel } from "@/domain/models/electronic-time-clock";

export interface ListElectronicTimeClockParams {
	dateBegin?: Date;
	dateEnd?: Date;
}

export interface ListElectronicTimeClock {
	execute(
		params?: ListElectronicTimeClockParams,
	): Promise<ElectronicTimeClockModel[]>;
}
