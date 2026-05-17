import { auth } from "@ponto-up-backend/auth";
import { toNodeHandler } from "better-auth/node";
import { Router } from "express";
import { authRoutes } from "@/main/routes/auth-routes";
import { timeClockRoutes } from "@/main/routes/time-clock-routes";
import { userRoutes } from "@/main/routes/user-routes";

export const router = Router();

router.all("/auth{/*path}", toNodeHandler(auth));

authRoutes(router);

timeClockRoutes(router);

userRoutes(router);

router.get("/health", (_req, res) => {
	res.json({ status: "OK" });
});
