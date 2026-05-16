import { SignInUseCase } from "@/data/usecases/auth/signin-usecase";
import { BetterAuthService } from "@/infra/db/auth-service";

export const makeSignInUseCase = () => {
	const authService = new BetterAuthService();
	return new SignInUseCase(authService);
};
