import { createDb } from "@ponto-up-backend/db";
import * as schema from "@ponto-up-backend/db/schema/auth";
import { eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers.authorization;

	if (!authHeader?.startsWith("Bearer ")) {
		res.status(401).json({ error: "Unauthorized - No token provided" });
		return;
	}

	const token = authHeader.substring(7);

	const db = createDb();

	db.query.session
		.findFirst({
			where: eq(schema.session.token, token),
			with: {
				user: true,
			},
		})
		.then((session) => {
			if (!session) {
				res.status(401).json({ error: "Unauthorized - Invalid token" });
				return;
			}

			if (session.expiresAt && session.expiresAt < new Date()) {
				res.status(401).json({ error: "Unauthorized - Token expired" });
				return;
			}

			req.headers["x-user-id"] = session.userId;
			next();
		})
		.catch((error) => {
			next(error);
		});
}
