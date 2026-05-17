import { GetUserByIdUseCase } from "@/data/usecases/user/get-user-by-id-usecase";
import { UserService } from "@/infra/db/user-service";

export function makeGetUserByIdUseCase() {
	const service = new UserService();
	return new GetUserByIdUseCase(service);
}
