import type { AuthResult, SignUpParams } from "@/domain/models/user";

export interface SignUp {
	execute(params: SignUpParams): Promise<AuthResult>;
}
