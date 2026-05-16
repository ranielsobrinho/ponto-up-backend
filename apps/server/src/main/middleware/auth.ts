import { auth } from "@ponto-up-backend/auth";
import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
	auth.api
		.getSession({ headers: fromNodeHeaders(req.headers) })
		.then((session) => {
			if (!session) {
				res.status(401).json({ error: "Unauthorized" });
				return;
			}
			req.headers["x-user-id"] = session.user.id;
			next();
		})
		.catch((error) => {
			next(error);
		});
}
