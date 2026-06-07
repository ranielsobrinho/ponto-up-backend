import type { NextFunction, Request, Response } from "express";
import type { CreateElectronicTimeClock } from "@/domain/usecases/create-electronic-time-clock";
import { parseISODate } from "@/main/utils/date";

interface CreateTimeClockBody {
	title: string;
	clockIn: string;
	clockOut: string;
	observations?: string;
}

export class CreateElectronicTimeClockController {
	constructor(private readonly createUseCase: CreateElectronicTimeClock) {}

	async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.headers["x-user-id"] as string;
			const body = req.body as CreateTimeClockBody;

			const result = await this.createUseCase.execute({
				title: body.title,
				clockIn: parseISODate(body.clockIn),
				clockOut: parseISODate(body.clockOut),
				observations: body.observations,
				createdBy: userId,
			});
			res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	}
}
