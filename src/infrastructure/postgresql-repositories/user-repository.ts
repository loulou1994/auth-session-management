import postgres from "postgres";

import { IUserRepository } from "../../application/interfaces/user-repository.ts";
import { UserSignup } from "../../entities/user.ts";

export class UserRepository implements IUserRepository {

    constructor(private pgClient: postgres.Sql<{}>){
        this.pgClient = pgClient
    }

    async createUser(newUser: UserSignup){
        await this.pgClient`
            INSERT INTO "user"
            (username, email, passwordHash) VALUES
            (${newUser.username}, ${newUser.email}, ${newUser.passwordHash});
        `
    }
}