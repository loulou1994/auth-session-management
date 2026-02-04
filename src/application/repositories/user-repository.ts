import type { User, UserLoginDto, UserSignupDto } from "@entities/user";

export interface IUserRepository {
	createUser(newUser: UserSignupDto): Promise<string>;
	findEmail(email: string): Promise<User | null>;
	findUnique(userId: string): Promise<User | null>
	userExists(newUser: UserSignupDto): Promise<boolean>
	deleteAll(): Promise<void>
}
