import type { UserSignup } from "../../shared/types.ts"
import type { User } from "../../entities/user.ts"

export interface IUserRepository {
    createUser(newUser: UserSignup): Promise<User>
}