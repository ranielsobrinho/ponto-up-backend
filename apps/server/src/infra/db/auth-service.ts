import { auth } from "@ponto-up-backend/auth";
import { createDb } from "@ponto-up-backend/db";
import * as schema from "@ponto-up-backend/db/schema/auth";
import type { AuthServiceProtocol } from "@/data/protocols/db/auth-protocol";
import type {
	AdminSignUpParams,
	AuthResult,
	SignInParams,
	SignUpParams,
} from "@/domain/models/user";

type AuthUser = typeof result.user & { role?: string };
type AuthResponse = {
	user: AuthUser;
	session?: { id: string; userId: string; expiresAt: Date };
};

export class BetterAuthService implements AuthServiceProtocol {
	private db = createDb();

	async signUp(params: SignUpParams): Promise<AuthResult> {
		const result = (await auth.api.signUpEmail({
			body: {
				name: params.name,
				email: params.email,
				password: params.password,
			},
		})) as AuthResponse;

		return {
			user: {
				id: result.user.id,
				name: result.user.name,
				email: result.user.email,
				emailVerified: result.user.emailVerified,
				role: result.user.role ?? "user",
				image: result.user.image ?? undefined,
				createdAt: result.user.createdAt,
				updatedAt: result.user.updatedAt,
			},
			session: {
				id: result.session?.id ?? "",
				userId: result.session?.userId ?? "",
				expiresAt: result.session?.expiresAt ?? new Date(),
			},
		};
	}

	async adminSignUp(params: AdminSignUpParams): Promise<AuthResult> {
		const result = (await auth.api.signUpEmail({
			body: {
				name: params.name,
				email: params.email,
				password: params.password,
			},
		})) as AuthResponse;

		await this.db
			.update(schema.user)
			.set({ role: "admin" })
			.where(eq(schema.user.id, result.user.id));

		return {
			user: {
				id: result.user.id,
				name: result.user.name,
				email: result.user.email,
				emailVerified: result.user.emailVerified,
				role: "admin",
				image: result.user.image ?? undefined,
				createdAt: result.user.createdAt,
				updatedAt: result.user.updatedAt,
			},
			session: {
				id: result.session?.id ?? "",
				userId: result.session?.userId ?? "",
				expiresAt: result.session?.expiresAt ?? new Date(),
			},
		};
	}

	async signIn(params: SignInParams): Promise<AuthResult> {
		const result = (await auth.api.signInEmail({
			body: {
				email: params.email,
				password: params.password,
			},
		})) as AuthResponse;

		return {
			user: {
				id: result.user.id,
				name: result.user.name,
				email: result.user.email,
				emailVerified: result.user.emailVerified,
				role: result.user.role ?? "user",
				image: result.user.image ?? undefined,
				createdAt: result.user.createdAt,
				updatedAt: result.user.updatedAt,
			},
			session: {
				id: result.session?.id ?? "",
				userId: result.session?.userId ?? "",
				expiresAt: result.session?.expiresAt ?? new Date(),
			},
		};
	}
}

import { eq } from "drizzle-orm";
