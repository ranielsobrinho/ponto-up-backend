import type { ElectronicTimeClockModel } from "@/domain/models/electronic-time-clock";

export interface GetElectronicTimeClockById {
	execute(id: number): Promise<ElectronicTimeClockModel | null>;
}
