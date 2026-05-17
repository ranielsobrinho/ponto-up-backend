import type {
	ListUsersParams,
	ListUsersResult,
	UpdateUserParams,
	UserModel,
} from "@/domain/models/user";

export interface UserProtocol {
	getById(id: string): Promise<UserModel | null>;
	list(params: ListUsersParams): Promise<ListUsersResult>;
	update(id: string, params: UpdateUserParams): Promise<UserModel>;
	updatePassword(id: string, newPassword: string): Promise<void>;
}
