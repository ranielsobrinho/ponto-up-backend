import type { NextFunction, Request, Response } from "express";
import type { UpdateUserPassword } from "@/domain/usecases/update-user-password";

export class UpdateUserPasswordController {
	constructor(private readonly updateUserPasswordUseCase: UpdateUserPassword) {}

	async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const idParam = req.params.id;
			const id = String(idParam);
			const { newPassword } = req.body;

			if (!id) {
				res.status(400).json({ error: "User ID is required" });
				return;
			}

			if (!newPassword) {
				res.status(400).json({ error: "New password is required" });
				return;
			}

			await this.updateUserPasswordUseCase.execute(id, newPassword);

			res.status(200).json({ message: "Password updated successfully" });
		} catch (error) {
			next(error);
		}
	}
}
