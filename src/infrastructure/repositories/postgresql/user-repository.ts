import postgres from "postgres";

import type { IUserRepository } from "@application/repositories/user-repository";
import { BaseRepository } from "./base-repository";
import { UserSignupDto } from "@entities/user";

export class UserRepository extends BaseRepository implements IUserRepository {
  private pgClient: postgres.Sql<{}>;

  constructor(pgClient: postgres.Sql<{}>) {
    super();
    this.pgClient = pgClient;
  }

  async createUser(newUser: UserSignupDto): Promise<string> {
    const { columns } = await this.executeDbOperation(async () => {
      return await this.pgClient`
            INSERT INTO "user"
            (username, email, passwordHash) VALUES
            (${newUser.username}, ${newUser.email}, ${newUser.password});
    `;
    });

    // console.log(columns[0])
    return "user id";
  }
}
