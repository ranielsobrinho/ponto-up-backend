import type { AdminSignUpParams, AuthResult } from "@/domain/models/user";

export interface AdminSignUp {
	execute(params: AdminSignUpParams): Promise<AuthResult>;
}
