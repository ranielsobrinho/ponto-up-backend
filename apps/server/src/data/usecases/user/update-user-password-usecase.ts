import type { UserProtocol } from "@/data/protocols/db/user-protocol";
import type { UpdateUserPassword } from "@/domain/usecases/update-user-password";

export class UpdateUserPasswordUseCase implements UpdateUserPassword {
	constructor(private readonly userService: UserProtocol) {}

	async execute(id: string, newPassword: string): Promise<void> {
		return this.userService.updatePassword(id, newPassword);
	}
}
