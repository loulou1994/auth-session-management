import type { UserSignupDto } from "@entities/user";

export interface IUserRepository {
  createUser(newUser: UserSignupDto): Promise<string>;
}
