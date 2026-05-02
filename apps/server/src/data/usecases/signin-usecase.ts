import type { AuthServiceProtocol } from "@/data/protocols/auth-protocol";
import type { AuthResult, SignInParams } from "@/domain/models/user";
import type { SignIn } from "@/domain/usecases/signin";

export class SignInUseCase implements SignIn {
	constructor(private readonly authService: AuthServiceProtocol) {}

	async execute(params: SignInParams): Promise<AuthResult> {
		return this.authService.signIn(params);
	}
}
