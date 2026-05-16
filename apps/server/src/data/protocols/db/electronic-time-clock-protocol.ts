import type {
	CreateElectronicTimeClockParams,
	ElectronicTimeClockModel,
	UpdateElectronicTimeClockParams,
} from "@/domain/models/electronic-time-clock";

export interface ElectronicTimeClockProtocol {
	create(
		params: CreateElectronicTimeClockParams,
	): Promise<ElectronicTimeClockModel>;
	list(params?: {
		dateBegin?: Date;
		dateEnd?: Date;
	}): Promise<ElectronicTimeClockModel[]>;
	getById(id: number): Promise<ElectronicTimeClockModel | null>;
	getByCreator(creatorId: string): Promise<ElectronicTimeClockModel[]>;
	update(
		id: number,
		params: UpdateElectronicTimeClockParams,
	): Promise<ElectronicTimeClockModel>;
}
