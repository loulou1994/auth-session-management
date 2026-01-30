import type { IUserRepository } from "@application/repositories/user-repository";
import type { User, UserLoginDto, UserSignupDto } from "@entities/user";
import type postgres from "postgres";
import { BaseRepository } from "./base-repository";

export class UserRepository extends BaseRepository implements IUserRepository {
	private pgClient: postgres.Sql<Record<string, unknown>>;

	constructor(pgClient: postgres.Sql<Record<string, unknown>>) {
		super();
		this.pgClient = pgClient;
	}

	async createUser(newUser: UserSignupDto): Promise<string> {
		const [{ id: userId }] = await this.executeDbOperation(
			async () => {
				return this.pgClient`
            INSERT INTO "user"
            (username, email, passwordHash) VALUES
            (${newUser.username}, ${newUser.email}, ${newUser.password})
            returning id
        `;
			},
			{ operation: "create user" },
		);

		return userId;
	}

	async findEmail(inputUser: UserLoginDto): Promise<User | null> {
		const [user] = await this.executeDbOperation(() => {
			return this.pgClient`
        SELECT * 
        FROM "user"
        WHERE email = ${inputUser.email}
      `;
		});

		if (!user) {
			return null
		}

		return {
			id: user.id,
			email: user.email,
			passwordHash: user.passwordhash,
			username: user.username
		}
	}

	async findUnique(userId: string): Promise<User | null> {
		const [user] = await this.executeDbOperation(async () => {
			return await this.pgClient`
				SELECT *
				FROM "user"
				WHERE id = ${userId}
			`
		}, {
			operation: "find user"
		})

		if (!user) return null

		return {
			id: user.id,
			username: user.email,
			email: user.email,
			passwordHash: user.passwordhash
		}
	}
}
