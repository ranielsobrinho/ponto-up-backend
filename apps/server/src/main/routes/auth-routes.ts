import type { Router } from "express";
import { expressRouteAdapter } from "@/main/adapters/express-route-adapter";
import { makeAdminSignUpController } from "@/main/factories/controllers/make-admin-signup-controller";
import { makeSignInController } from "@/main/factories/controllers/make-signin-controller";
import { makeSignUpController } from "@/main/factories/controllers/make-signup-controller";
import { validate } from "@/main/middleware/validate";
import {
	adminSignupSchema,
	signinSchema,
	signupSchema,
} from "@/main/schemas/auth-schemas";

export const authRoutes = (router: Router) => {
	router.post(
		"/signup",
		validate(signupSchema),
		expressRouteAdapter(makeSignUpController()),
	);

	router.post(
		"/admin-signup",
		validate(adminSignupSchema),
		expressRouteAdapter(makeAdminSignUpController()),
	);

	router.post(
		"/signin",
		validate(signinSchema),
		expressRouteAdapter(makeSignInController()),
	);
};
