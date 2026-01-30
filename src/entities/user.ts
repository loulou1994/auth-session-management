export type User = {
	id: string;
	username: string;
	email: string;
	passwordHash: string;
};

export type UserSignupDto = Omit<User, "id" | "passwordHash"> & {
	password: string;
};

export type UserLoginDto = {
	email: string;
	password: string;
};
