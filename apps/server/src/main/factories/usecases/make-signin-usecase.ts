import { SignInUseCase } from "@/data/usecases/signin-usecase";
import { BetterAuthService } from "@/infra/auth-service";

export const makeSignInUseCase = () => {
	const authService = new BetterAuthService();
	return new SignInUseCase(authService);
};
