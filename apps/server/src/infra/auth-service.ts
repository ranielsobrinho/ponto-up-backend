import { auth } from "@ponto-up-backend/auth";
import type { AuthServiceProtocol } from "@/data/protocols/auth-protocol";
import type {
	AuthResult,
	SignInParams,
	SignUpParams,
} from "@/domain/models/user";

export class BetterAuthService implements AuthServiceProtocol {
	async signUp(params: SignUpParams): Promise<AuthResult> {
		const result = await auth.api.signUpEmail({
			body: {
				name: params.name,
				email: params.email,
				password: params.password,
			},
		});

		return {
			user: {
				id: result.user.id,
				name: result.user.name,
				email: result.user.email,
				emailVerified: result.user.emailVerified,
				image: result.user.image ?? undefined,
				createdAt: result.user.createdAt,
				updatedAt: result.user.updatedAt,
			},
			session: {
				id: (result as any).session?.id ?? "",
				userId: (result as any).session?.userId ?? "",
				expiresAt: (result as any).session?.expiresAt ?? new Date(),
			},
		};
	}

	async signIn(params: SignInParams): Promise<AuthResult> {
		const result = await auth.api.signInEmail({
			body: {
				email: params.email,
				password: params.password,
			},
		});

		return {
			user: {
				id: result.user.id,
				name: result.user.name,
				email: result.user.email,
				emailVerified: result.user.emailVerified,
				image: result.user.image ?? undefined,
				createdAt: result.user.createdAt,
				updatedAt: result.user.updatedAt,
			},
			session: {
				id: (result as any).session?.id ?? "",
				userId: (result as any).session?.userId ?? "",
				expiresAt: (result as any).session?.expiresAt ?? new Date(),
			},
		};
	}
}
