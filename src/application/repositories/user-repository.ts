import type { User, UserLoginDto, UserSignupDto } from "@entities/user";

export interface IUserRepository {
	createUser(newUser: UserSignupDto): Promise<string>;
	findEmail(user: UserLoginDto): Promise<User | null>;
	findUnique(userId: string): Promise<User | null>
}
