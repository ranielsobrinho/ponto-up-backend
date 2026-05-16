import type { NextFunction, Request, Response } from "express";
import type { UpdateElectronicTimeClock } from "@/domain/usecases/update-electronic-time-clock";

interface UpdateTimeClockBody {
	title?: string;
	clockIn?: string;
	clockOut?: string;
	observations?: string;
}

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

			const body = req.body as UpdateTimeClockBody;

			const updateParams = {
				...(body.title && { title: body.title }),
				...(body.clockIn && { clockIn: new Date(body.clockIn) }),
				...(body.clockOut && { clockOut: new Date(body.clockOut) }),
				...(body.observations !== undefined && {
					observations: body.observations,
				}),
			};

			const result = await this.updateUseCase.execute(id, updateParams);
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	}
}
