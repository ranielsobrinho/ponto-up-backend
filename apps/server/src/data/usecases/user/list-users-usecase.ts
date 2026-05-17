import type { UserProtocol } from "@/data/protocols/db/user-protocol";
import type { ListUsersParams, ListUsersResult } from "@/domain/models/user";
import type { ListUsers } from "@/domain/usecases/list-users";

export class ListUsersUseCase implements ListUsers {
	constructor(private readonly userService: UserProtocol) {}

	async execute(params: ListUsersParams): Promise<ListUsersResult> {
		return this.userService.list(params);
	}
}
