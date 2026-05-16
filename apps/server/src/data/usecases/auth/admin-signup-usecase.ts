import { env } from "@ponto-up-backend/env/server";
import type { AuthServiceProtocol } from "@/data/protocols/db/auth-protocol";
import type { AdminSignUpParams, AuthResult } from "@/domain/models/user";
import type { AdminSignUp } from "@/domain/usecases/admin-signup";

export class AdminSignUpUseCase implements AdminSignUp {
	constructor(private readonly authService: AuthServiceProtocol) {}

	async execute(params: AdminSignUpParams): Promise<AuthResult> {
		if (params.adminSecret !== env.ADMIN_SECRET) {
			throw new Error("Invalid admin secret");
		}

		return this.authService.adminSignUp(params);
	}
}
