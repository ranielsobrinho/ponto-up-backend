import type { ElectronicTimeClockModel } from "@/domain/models/electronic-time-clock";

export interface GetElectronicTimeClockByCreator {
	execute(creatorId: string): Promise<ElectronicTimeClockModel[]>;
}
