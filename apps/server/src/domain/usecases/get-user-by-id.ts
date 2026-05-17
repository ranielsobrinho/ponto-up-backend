import type { UserModel } from "@/domain/models/user";

export interface GetUserById {
	execute(id: string): Promise<UserModel | null>;
}
