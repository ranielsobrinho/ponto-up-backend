import { makeSignUpUseCase } from "@/main/factories/usecases/make-signup-usecase";
import { SignUpController } from "@/presentation/controllers/signup-controller";

export const makeSignUpController = () => {
	return new SignUpController(makeSignUpUseCase());
};
