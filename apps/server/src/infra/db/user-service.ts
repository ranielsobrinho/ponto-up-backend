import { createDb } from "@ponto-up-backend/db";
import * as schema from "@ponto-up-backend/db/schema/auth";
import { and, eq } from "drizzle-orm";
import type { UserProtocol } from "@/data/protocols/db/user-protocol";
import type {
	ListUsersParams,
	ListUsersResult,
	UpdateUserParams,
	UserModel,
} from "@/domain/models/user";

export class UserService implements UserProtocol {
	private db = createDb();

	async getById(id: string): Promise<UserModel | null> {
		const [result] = await this.db
			.select()
			.from(schema.user)
			.where(eq(schema.user.id, id))
			.limit(1);

		if (!result) {
			return null;
		}

		return this.mapToUserModel(result);
	}

	async list(params: ListUsersParams): Promise<ListUsersResult> {
		const page = params.page ?? 1;
		const limit = params.limit ?? 10;
		const offset = (page - 1) * limit;

		const [countResult] = await this.db
			.select({ count: schema.user.id })
			.from(schema.user);

		const users = await this.db
			.select()
			.from(schema.user)
			.limit(limit)
			.offset(offset)
			.orderBy(schema.user.createdAt);

		const total = Number(countResult?.count ?? 0);

		return {
			users: users.map(this.mapToUserModel),
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	}

	async update(id: string, params: UpdateUserParams): Promise<UserModel> {
		const updateData: Partial<typeof schema.user._.inferInsert> = {};

		if (params.name !== undefined) {
			updateData.name = params.name;
		}
		if (params.email !== undefined) {
			updateData.email = params.email;
		}
		if (params.image !== undefined) {
			updateData.image = params.image;
		}
		if (params.role !== undefined) {
			updateData.role = params.role;
		}

		const [result] = await this.db
			.update(schema.user)
			.set(updateData)
			.where(eq(schema.user.id, id))
			.returning();

		if (!result) {
			throw new Error("Failed to update user");
		}

		return this.mapToUserModel(result);
	}

	async updatePassword(id: string, newPassword: string): Promise<void> {
		const [account] = await this.db
			.select()
			.from(schema.account)
			.where(
				and(
					eq(schema.account.userId, id),
					eq(schema.account.providerId, "email"),
				),
			)
			.limit(1);

		if (!account) {
			throw new Error("User does not have a password set");
		}

		await this.db
			.update(schema.account)
			.set({ password: newPassword })
			.where(eq(schema.account.id, account.id));
	}

	private mapToUserModel(row: typeof schema.user._.inferSelect): UserModel {
		return {
			id: row.id,
			name: row.name,
			email: row.email,
			emailVerified: row.emailVerified,
			role: row.role as "admin" | "user",
			image: row.image ?? undefined,
			createdAt: row.createdAt,
			updatedAt: row.updatedAt,
		};
	}
}
