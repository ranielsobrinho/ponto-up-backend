import { SignUpUseCase } from "@/data/usecases/auth/signup-usecase";
import { BetterAuthService } from "@/infra/db/auth-service";

export const makeSignUpUseCase = () => {
	const authService = new BetterAuthService();
	return new SignUpUseCase(authService);
};
