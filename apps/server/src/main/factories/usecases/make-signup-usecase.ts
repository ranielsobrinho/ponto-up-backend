import { SignUpUseCase } from "@/data/usecases/signup-usecase";
import { BetterAuthService } from "@/infra/auth-service";

export const makeSignUpUseCase = () => {
	const authService = new BetterAuthService();
	return new SignUpUseCase(authService);
};
