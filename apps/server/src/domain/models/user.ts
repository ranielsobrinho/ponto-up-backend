export type UserModel = {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	role: "admin" | "user";
	image?: string;
	createdAt: Date;
	updatedAt: Date;
};

export type SignUpParams = {
	name: string;
	email: string;
	password: string;
};

export type AdminSignUpParams = {
	name: string;
	email: string;
	password: string;
	adminSecret: string;
};

export type SignInParams = {
	email: string;
	password: string;
};

export type AuthResult = {
	user: UserModel;
	session: {
		id: string;
		userId: string;
		expiresAt: Date;
	};
	token?: string;
};

export type UpdateUserParams = {
	name?: string;
	email?: string;
	image?: string;
	role?: "admin" | "user";
};

export type ListUsersParams = {
	page?: number;
	limit?: number;
};

export type ListUsersResult = {
	users: UserModel[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
};
