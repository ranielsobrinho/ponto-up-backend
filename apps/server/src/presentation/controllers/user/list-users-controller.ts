import type { NextFunction, Request, Response } from "express";
import type { ListUsers } from "@/domain/usecases/list-users";

export class ListUsersController {
	constructor(private readonly listUsersUseCase: ListUsers) {}

	async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const page = Number.parseInt(String(req.query.page), 10) || 1;
			const limit = Number.parseInt(String(req.query.limit), 10) || 10;

			const result = await this.listUsersUseCase.execute({ page, limit });

			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	}
}
