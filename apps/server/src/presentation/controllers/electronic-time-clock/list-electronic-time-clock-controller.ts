import type { NextFunction, Request, Response } from "express";
import type { ListElectronicTimeClock } from "@/domain/usecases/list-electronic-time-clock";

export class ListElectronicTimeClockController {
	constructor(private readonly listUseCase: ListElectronicTimeClock) {}

	async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { dateBegin, dateEnd } = req.query;

			const params = {
				...(dateBegin && { dateBegin: new Date(dateBegin as string) }),
				...(dateEnd && { dateEnd: new Date(dateEnd as string) }),
			};

			const result = await this.listUseCase.execute(
				Object.keys(params).length > 0 ? params : undefined,
			);
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	}
}
