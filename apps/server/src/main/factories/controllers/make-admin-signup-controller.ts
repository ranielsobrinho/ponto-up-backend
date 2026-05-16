import { makeAdminSignUpUseCase } from "@/main/factories/usecases/make-admin-signup-usecase";
import { AdminSignUpController } from "@/presentation/controllers/auth/admin-signup-controller";

export const makeAdminSignUpController = () => {
	return new AdminSignUpController(makeAdminSignUpUseCase());
};
