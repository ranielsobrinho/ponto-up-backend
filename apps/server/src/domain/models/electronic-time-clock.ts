export type ElectronicTimeClockModel = {
	id: number;
	title: string;
	clockIn: Date;
	clockOut: Date;
	observations: string | null;
	createdAt: Date;
	createdBy: string;
};

export type CreateElectronicTimeClockParams = {
	title: string;
	clockIn: Date;
	clockOut: Date;
	observations?: string;
	createdBy: string;
};

export type UpdateElectronicTimeClockParams = {
	title?: string;
	clockIn?: Date;
	clockOut?: Date;
	observations?: string;
};
