import type { NextFunction, Request, Response } from "express";
import type {
	ListElectronicTimeClock,
	ListElectronicTimeClockParams,
} from "@/domain/usecases/list-electronic-time-clock";
import { parseISODate } from "@/main/utils/date";

export class ListElectronicTimeClockController {
	constructor(private readonly listUseCase: ListElectronicTimeClock) {}

	async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { startDate, endDate } = req.query;
			const userId = req.headers["x-user-id"] as string;

			const params: ListElectronicTimeClockParams = {
				userId,
				startDate: parseISODate(`${startDate}T00:00:00`),
				endDate: parseISODate(`${endDate}T23:59:59`),
			};

			const result = await this.listUseCase.execute(params);
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	}
}
