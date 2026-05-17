export interface UpdateUserPassword {
	execute(id: string, newPassword: string): Promise<void>;
}
