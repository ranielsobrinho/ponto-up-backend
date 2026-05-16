import type { NextFunction, Request, Response } from "express";
import type { CreateElectronicTimeClock } from "@/domain/usecases/create-electronic-time-clock";

export class CreateElectronicTimeClockController {
	constructor(private readonly createUseCase: CreateElectronicTimeClock) {}

	async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.headers["x-user-id"] as string;
			const result = await this.createUseCase.execute({
				...req.body,
				createdBy: userId,
			});
			res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	}
}
