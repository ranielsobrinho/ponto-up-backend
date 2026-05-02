import { makeSignInUseCase } from "@/main/factories/usecases/make-signin-usecase";
import { SignInController } from "@/presentation/controllers/signin-controller";

export const makeSignInController = () => {
	return new SignInController(makeSignInUseCase());
};
