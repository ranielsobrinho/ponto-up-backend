import type { Router } from "express";
import { expressRouteAdapter } from "@/main/adapters/express-route-adapter";
import { makeGetDashboardController } from "@/main/factories/controllers/make-get-dashboard-controller";
import { requireAuth } from "@/main/middleware/auth";

export const dashboardRoutes = (router: Router) => {
	router.get(
		"/dashboard",
		requireAuth,
		expressRouteAdapter(makeGetDashboardController()),
	);
};
