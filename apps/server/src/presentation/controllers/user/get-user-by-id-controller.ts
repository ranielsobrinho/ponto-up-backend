import type { NextFunction, Request, Response } from "express";
import type { GetUserById } from "@/domain/usecases/get-user-by-id";

export class GetUserByIdController {
	constructor(private readonly getUserByIdUseCase: GetUserById) {}

	async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const idParam = req.params.id;
			const id = String(idParam);

			if (!id) {
				res.status(400).json({ error: "User ID is required" });
				return;
			}

			const result = await this.getUserByIdUseCase.execute(id);

			if (!result) {
				res.status(404).json({ error: "User not found" });
				return;
			}

			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	}
}
