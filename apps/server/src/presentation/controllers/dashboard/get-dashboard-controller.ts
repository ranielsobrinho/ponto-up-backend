import type { NextFunction, Request, Response } from "express";
import type { GetDashboard } from "@/domain/usecases/get-dashboard";

export class GetDashboardController {
	constructor(private readonly getDashboardUseCase: GetDashboard) {}

	async handle(
		_req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const stats = await this.getDashboardUseCase.execute();
			res.status(200).json(stats);
		} catch (error) {
			next(error);
		}
	}
}
