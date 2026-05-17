import type { UserProtocol } from "@/data/protocols/db/user-protocol";
import type { UpdateUserParams, UserModel } from "@/domain/models/user";
import type { UpdateUser } from "@/domain/usecases/update-user";

export class UpdateUserUseCase implements UpdateUser {
	constructor(private readonly userService: UserProtocol) {}

	async execute(id: string, params: UpdateUserParams): Promise<UserModel> {
		return this.userService.update(id, params);
	}
}
