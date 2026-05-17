import type { NextFunction, Request, Response } from "express";
import type { UpdateUser } from "@/domain/usecases/update-user";

export class UpdateUserController {
	constructor(private readonly updateUserUseCase: UpdateUser) {}

	async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const idParam = req.params.id;
			const id = String(idParam);

			if (!id) {
				res.status(400).json({ error: "User ID is required" });
				return;
			}

			const result = await this.updateUserUseCase.execute(id, req.body);

			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	}
}
