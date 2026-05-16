import { auth } from "@ponto-up-backend/auth";
import { createDb } from "@ponto-up-backend/db";
import * as schema from "@ponto-up-backend/db/schema/auth";
import { eq } from "drizzle-orm";
import type { AuthServiceProtocol } from "@/data/protocols/db/auth-protocol";
import type {
	AdminSignUpParams,
	AuthResult,
	SignInParams,
	SignUpParams,
} from "@/domain/models/user";

interface BetterAuthUser {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image: string | null;
	createdAt: Date;
	updatedAt: Date;
	role?: string;
	banned?: boolean;
	banReason?: string;
	banExpires?: Date;
}

interface BetterAuthResponse {
	user: BetterAuthUser;
	session?: { id: string; userId: string; expiresAt: Date };
	token?: string;
}

export class BetterAuthService implements AuthServiceProtocol {
	private db = createDb();

	async signUp(params: SignUpParams): Promise<AuthResult> {
		const result = (await auth.api.signUpEmail({
			body: {
				name: params.name,
				email: params.email,
				password: params.password,
			},
		})) as BetterAuthResponse;

		return {
			user: {
				id: result.user.id,
				name: result.user.name,
				email: result.user.email,
				emailVerified: result.user.emailVerified,
				role: (result.user.role as "admin" | "user") ?? "user",
				image: result.user.image ?? undefined,
				createdAt: result.user.createdAt,
				updatedAt: result.user.updatedAt,
			},
			session: {
				id: result.session?.id ?? "",
				userId: result.session?.userId ?? "",
				expiresAt: result.session?.expiresAt ?? new Date(),
			},
			token: result.token,
		};
	}

	async adminSignUp(params: AdminSignUpParams): Promise<AuthResult> {
		const result = (await auth.api.signUpEmail({
			body: {
				name: params.name,
				email: params.email,
				password: params.password,
			},
		})) as BetterAuthResponse;

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
			token: result.token,
		};
	}

	async signIn(params: SignInParams): Promise<AuthResult> {
		const result = (await auth.api.signInEmail({
			body: {
				email: params.email,
				password: params.password,
			},
		})) as BetterAuthResponse;

		console.log("oLha o result =>", result);

		return {
			user: {
				id: result.user.id,
				name: result.user.name,
				email: result.user.email,
				emailVerified: result.user.emailVerified,
				role: (result.user.role as "admin" | "user") ?? "user",
				image: result.user.image ?? undefined,
				createdAt: result.user.createdAt,
				updatedAt: result.user.updatedAt,
			},
			session: {
				id: result.session?.id ?? "",
				userId: result.session?.userId ?? "",
				expiresAt: result.session?.expiresAt ?? new Date(),
			},
			token: result.token,
		};
	}
}
