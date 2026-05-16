import { makeSignUpUseCase } from "@/main/factories/usecases/make-signup-usecase";
import { SignUpController } from "@/presentation/controllers/auth/signup-controller";

export const makeSignUpController = () => {
	return new SignUpController(makeSignUpUseCase());
};
