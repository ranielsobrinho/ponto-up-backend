import type { NextFunction, Request, Response } from "express";
import type { GetElectronicTimeClockByCreator } from "@/domain/usecases/get-electronic-time-clock-by-creator";

export class GetElectronicTimeClockByCreatorController {
	constructor(
		private readonly getByCreatorUseCase: GetElectronicTimeClockByCreator,
	) {}

	async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.params.userId as string;
			const result = await this.getByCreatorUseCase.execute(userId);
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	}
}
