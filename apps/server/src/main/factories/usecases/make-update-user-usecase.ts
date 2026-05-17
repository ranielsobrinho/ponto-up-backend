import { UpdateUserUseCase } from "@/data/usecases/user/update-user-usecase";
import { UserService } from "@/infra/db/user-service";

export function makeUpdateUserUseCase() {
	const service = new UserService();
	return new UpdateUserUseCase(service);
}
