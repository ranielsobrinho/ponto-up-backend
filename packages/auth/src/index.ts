import { createDb } from "@ponto-up-backend/db";
import * as schema from "@ponto-up-backend/db/schema/auth";
import { env } from "@ponto-up-backend/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";

export function createAuth() {
	const db = createDb();

	return betterAuth({
		database: drizzleAdapter(db, {
			provider: "pg",

			schema: schema,
		}),
		trustedOrigins: [env.CORS_ORIGIN],
		emailAndPassword: {
			enabled: true,
		},
		secret: env.BETTER_AUTH_SECRET,
		baseURL: env.BETTER_AUTH_URL,
		advanced: {
			cookiePrefix: "better-auth",
			defaultCookieAttributes: {
				sameSite: "lax",
				secure: env.NODE_ENV === "production",
				httpOnly: true,
				path: "/",
			},
		},
		session: {
			expiresIn: 60 * 60 * 24 * 3, // 3 days
			updateAge: 60 * 60 * 24, // 1 day
		},
		plugins: [
			admin({
				defaultRole: "user",
				adminUserIds: [],
			}),
		],
	});
}

export const auth = createAuth();
