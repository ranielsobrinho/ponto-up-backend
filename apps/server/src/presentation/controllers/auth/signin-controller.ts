import type { NextFunction, Request, Response } from "express";
import type { SignIn } from "@/domain/usecases/signin";

export class SignInController {
	constructor(private readonly signInUseCase: SignIn) {}

	async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const result = await this.signInUseCase.execute(req.body);
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	}
}
