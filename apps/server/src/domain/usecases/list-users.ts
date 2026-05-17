import type { ListUsersParams, ListUsersResult } from "@/domain/models/user";

export interface ListUsers {
	execute(params: ListUsersParams): Promise<ListUsersResult>;
}
