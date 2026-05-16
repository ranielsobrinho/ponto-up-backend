import type { Router } from "express";
import { expressRouteAdapter } from "@/main/adapters/express-route-adapter";
import { makeCreateElectronicTimeClockController } from "@/main/factories/controllers/make-create-electronic-time-clock-controller";
import { makeGetElectronicTimeClockByCreatorController } from "@/main/factories/controllers/make-get-electronic-time-clock-by-creator-controller";
import { makeGetElectronicTimeClockByIdController } from "@/main/factories/controllers/make-get-electronic-time-clock-by-id-controller";
import { makeListElectronicTimeClockController } from "@/main/factories/controllers/make-list-electronic-time-clock-controller";
import { makeUpdateElectronicTimeClockController } from "@/main/factories/controllers/make-update-electronic-time-clock-controller";
import { requireAuth } from "@/main/middleware/auth";
import { validate } from "@/main/middleware/validate";
import {
	createElectronicTimeClockSchema,
	updateElectronicTimeClockSchema,
} from "@/main/schemas/electronic-time-clock-schemas";

export const timeClockRoutes = (router: Router) => {
	router.post(
		"/time-clock",
		requireAuth,
		validate(createElectronicTimeClockSchema),
		expressRouteAdapter(makeCreateElectronicTimeClockController()),
	);

	router.get(
		"/time-clock",
		requireAuth,
		expressRouteAdapter(makeListElectronicTimeClockController()),
	);

	router.get(
		"/time-clock/:userId",
		requireAuth,
		expressRouteAdapter(makeGetElectronicTimeClockByCreatorController()),
	);

	router.get(
		"/time-clock/:id",
		requireAuth,
		expressRouteAdapter(makeGetElectronicTimeClockByIdController()),
	);

	router.put(
		"/time-clock/:id",
		requireAuth,
		validate(updateElectronicTimeClockSchema),
		expressRouteAdapter(makeUpdateElectronicTimeClockController()),
	);
};
