import type { NextFunction, Request, Response } from "express";
import type { UpdateElectronicTimeClock } from "@/domain/usecases/update-electronic-time-clock";

export class UpdateElectronicTimeClockController {
	constructor(private readonly updateUseCase: UpdateElectronicTimeClock) {}

	async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const idParam = req.params.id;
			const id = Number.parseInt(String(idParam), 10);

			if (Number.isNaN(id)) {
				res.status(400).json({ error: "Invalid ID format" });
				return;
			}

			const result = await this.updateUseCase.execute(id, req.body);
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	}
}
