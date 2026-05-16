import type {
	AdminSignUpParams,
	AuthResult,
	SignInParams,
	SignUpParams,
} from "@/domain/models/user";

export interface AuthServiceProtocol {
	signUp(params: SignUpParams): Promise<AuthResult>;
	adminSignUp(params: AdminSignUpParams): Promise<AuthResult>;
	signIn(params: SignInParams): Promise<AuthResult>;
}
