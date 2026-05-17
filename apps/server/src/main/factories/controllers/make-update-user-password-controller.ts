import { makeUpdateUserPasswordUseCase } from "@/main/factories/usecases/make-update-user-password-usecase";
import { UpdateUserPasswordController } from "@/presentation/controllers/user/update-user-password-controller";

export function makeUpdateUserPasswordController() {
	const useCase = makeUpdateUserPasswordUseCase();
	return new UpdateUserPasswordController(useCase);
}
