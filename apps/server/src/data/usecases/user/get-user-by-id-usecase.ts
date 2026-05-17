import type { UserProtocol } from "@/data/protocols/db/user-protocol";
import type { UserModel } from "@/domain/models/user";
import type { GetUserById } from "@/domain/usecases/get-user-by-id";

export class GetUserByIdUseCase implements GetUserById {
	constructor(private readonly userService: UserProtocol) {}

	async execute(id: string): Promise<UserModel | null> {
		return this.userService.getById(id);
	}
}
