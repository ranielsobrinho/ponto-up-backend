import type { AuthResult, SignInParams } from "@/domain/models/user";

export interface SignIn {
	execute(params: SignInParams): Promise<AuthResult>;
}
