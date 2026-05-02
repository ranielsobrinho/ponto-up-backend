export type UserModel = {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image?: string;
	createdAt: Date;
	updatedAt: Date;
};

export type SignUpParams = {
	name: string;
	email: string;
	password: string;
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
};
