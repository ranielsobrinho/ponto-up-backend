import type { NextFunction, Request, Response } from "express";
import type { AdminSignUp } from "@/domain/usecases/admin-signup";

export class AdminSignUpController {
	constructor(private readonly adminSignUpUseCase: AdminSignUp) {}

	async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const result = await this.adminSignUpUseCase.execute(req.body);
			res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	}
}
