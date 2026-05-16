import { AdminSignUpUseCase } from "@/data/usecases/auth/admin-signup-usecase";
import { BetterAuthService } from "@/infra/db/auth-service";

export const makeAdminSignUpUseCase = () => {
	const authService = new BetterAuthService();
	return new AdminSignUpUseCase(authService);
};
