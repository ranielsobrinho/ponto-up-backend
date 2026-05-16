import type { NextFunction, Request, Response } from "express";
import type { GetElectronicTimeClockById } from "@/domain/usecases/get-electronic-time-clock-by-id";

export class GetElectronicTimeClockByIdController {
	constructor(private readonly getByIdUseCase: GetElectronicTimeClockById) {}

	async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const idParam = req.params.id;
			const id = Number.parseInt(String(idParam), 10);

			if (Number.isNaN(id)) {
				res.status(400).json({ error: "Invalid ID format" });
				return;
			}

			const result = await this.getByIdUseCase.execute(id);

			if (!result) {
				res.status(404).json({ error: "Time clock not found" });
				return;
			}

			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	}
}
