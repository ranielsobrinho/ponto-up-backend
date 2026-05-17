import type { UpdateUserParams, UserModel } from "@/domain/models/user";

export interface UpdateUser {
	execute(id: string, params: UpdateUserParams): Promise<UserModel>;
}
