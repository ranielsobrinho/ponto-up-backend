import { ListUsersUseCase } from "@/data/usecases/user/list-users-usecase";
import { UserService } from "@/infra/db/user-service";

export function makeListUsersUseCase() {
	const service = new UserService();
	return new ListUsersUseCase(service);
}
