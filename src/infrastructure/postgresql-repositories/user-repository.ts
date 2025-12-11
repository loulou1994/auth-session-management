import postgres from "postgres";

import type { IUserRepository } from "../../application/interfaces/user-repository.ts";
import type { UserSignup } from "../../shared/types.ts";
import type { User } from "../../entities/user.ts";

export class UserRepository implements IUserRepository {
  private pgClient: postgres.Sql<{}>;

  constructor(pgClient: postgres.Sql<{}>) {
    this.pgClient = pgClient;
  }

  async createUser(newUser: UserSignup): Promise<User> {
    const user = await this.pgClient`
            INSERT INTO "user"
            (username, email, passwordHash) VALUES
            (${newUser.username}, ${newUser.email}, ${newUser.password});
        `;

    return {
      id: "5489798231544",
      email: newUser.email,
      passwordHash: newUser.password,
      username: newUser.username,
    };
  }
}
