import type {
	AuthResult,
	SignInParams,
	SignUpParams,
} from "@/domain/models/user";

export interface AuthServiceProtocol {
	signUp(params: SignUpParams): Promise<AuthResult>;
	signIn(params: SignInParams): Promise<AuthResult>;
}
