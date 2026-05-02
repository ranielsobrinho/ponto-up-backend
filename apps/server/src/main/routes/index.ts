import { auth } from "@ponto-up-backend/auth";
import { toNodeHandler } from "better-auth/node";
import { Router } from "express";
import { authRoutes } from "@/main/routes/auth-routes";

export const router = Router();

router.all("/auth{/*path}", toNodeHandler(auth));

authRoutes(router);

router.get("/health", (_req, res) => {
	res.json({ status: "OK" });
});
