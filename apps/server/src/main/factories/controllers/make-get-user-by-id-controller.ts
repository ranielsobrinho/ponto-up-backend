import { makeGetUserByIdUseCase } from "@/main/factories/usecases/make-get-user-by-id-usecase";
import { GetUserByIdController } from "@/presentation/controllers/user/get-user-by-id-controller";

export function makeGetUserByIdController() {
	const useCase = makeGetUserByIdUseCase();
	return new GetUserByIdController(useCase);
}
