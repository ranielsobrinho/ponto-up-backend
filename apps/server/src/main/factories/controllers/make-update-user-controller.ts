import { makeUpdateUserUseCase } from "@/main/factories/usecases/make-update-user-usecase";
import { UpdateUserController } from "@/presentation/controllers/user/update-user-controller";

export function makeUpdateUserController() {
	const useCase = makeUpdateUserUseCase();
	return new UpdateUserController(useCase);
}
