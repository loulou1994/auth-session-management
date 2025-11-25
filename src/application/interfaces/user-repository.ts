import { UserSignup } from "../../entities/user.ts"

export interface IUserRepository {
    createUser: (newUser: UserSignup) => void
}