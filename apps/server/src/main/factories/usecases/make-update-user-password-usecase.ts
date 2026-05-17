import { UpdateUserPasswordUseCase } from "@/data/usecases/user/update-user-password-usecase";
import { UserService } from "@/infra/db/user-service";

export function makeUpdateUserPasswordUseCase() {
	const service = new UserService();
	return new UpdateUserPasswordUseCase(service);
}
