import { makeListUsersUseCase } from "@/main/factories/usecases/make-list-users-usecase";
import { ListUsersController } from "@/presentation/controllers/user/list-users-controller";

export function makeListUsersController() {
	const useCase = makeListUsersUseCase();
	return new ListUsersController(useCase);
}
