import type { Router } from "express";
import { expressRouteAdapter } from "@/main/adapters/express-route-adapter";
import { makeGetUserByIdController } from "@/main/factories/controllers/make-get-user-by-id-controller";
import { makeListUsersController } from "@/main/factories/controllers/make-list-users-controller";
import { makeUpdateUserController } from "@/main/factories/controllers/make-update-user-controller";
import { makeUpdateUserPasswordController } from "@/main/factories/controllers/make-update-user-password-controller";
import { requireAuth } from "@/main/middleware/auth";
import { validate } from "@/main/middleware/validate";
import {
	updateUserPasswordSchema,
	updateUserSchema,
} from "@/main/schemas/user-schemas";

export const userRoutes = (router: Router) => {
	router.get(
		"/users",
		requireAuth,
		expressRouteAdapter(makeListUsersController()),
	);

	router.get(
		"/users/:id",
		requireAuth,
		expressRouteAdapter(makeGetUserByIdController()),
	);

	router.put(
		"/users/:id",
		requireAuth,
		validate(updateUserSchema),
		expressRouteAdapter(makeUpdateUserController()),
	);

	router.put(
		"/users/:id/password",
		requireAuth,
		validate(updateUserPasswordSchema),
		expressRouteAdapter(makeUpdateUserPasswordController()),
	);
};
