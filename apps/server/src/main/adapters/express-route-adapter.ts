import type { NextFunction, Request, Response } from "express";

export interface Controller {
	handle(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export function expressRouteAdapter(controller: Controller) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await controller.handle(req, res, next);
		} catch (error) {
			next(error);
		}
	};
}
