import type { AuthServiceProtocol } from "@/data/protocols/db/auth-protocol";
import type { AuthResult, SignUpParams } from "@/domain/models/user";
import type { SignUp } from "@/domain/usecases/signup";

export class SignUpUseCase implements SignUp {
	constructor(private readonly authService: AuthServiceProtocol) {}

	async execute(params: SignUpParams): Promise<AuthResult> {
		return this.authService.signUp(params);
	}
}
