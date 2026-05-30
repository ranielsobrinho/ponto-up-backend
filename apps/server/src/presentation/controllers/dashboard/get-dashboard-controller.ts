import type { NextFunction, Request, Response } from "express";
import type { GetDashboardParams } from "@/domain/models/dashboard";
import type { GetDashboard } from "@/domain/usecases/get-dashboard";

export class GetDashboardController {
	constructor(private readonly getDashboardUseCase: GetDashboard) {}

	async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const requestingUserId = req.headers["x-user-id"] as string;
			const role = req.headers["x-user-role"] as string;

			const params: GetDashboardParams = {
				requestingUserId,
				isAdmin: role === "admin",
			};

			const stats = await this.getDashboardUseCase.execute(params);
			res.status(200).json(stats);
		} catch (error) {
			next(error);
		}
	}
}
