import type { NextFunction, Request, Response } from "express";
import type { SignUp } from "@/domain/usecases/signup";

export class SignUpController {
	constructor(private readonly signUpUseCase: SignUp) {}

	async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const result = await this.signUpUseCase.execute(req.body);
			res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	}
}
