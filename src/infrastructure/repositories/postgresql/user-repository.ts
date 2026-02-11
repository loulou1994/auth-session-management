import type postgres from "postgres";

import type { IUserRepository } from "@application/repositories/user-repository";
import type { User, UserSignupDto } from "@entities/user";
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

	async findEmail(email: string): Promise<User | null> {
		const [user] = await this.executeDbOperation(async () => {
			return this.pgClient`
        SELECT * 
        FROM "user"
        WHERE email = ${email}
      `;
		});

		if (!user) {
			return null;
		}

		return {
			id: user.id,
			email: user.email,
			passwordHash: user.passwordhash,
			username: user.username,
		};
	}

	async findUnique(userId: string): Promise<User | null> {
		const [user] = await this.executeDbOperation(
			async () => {
				return await this.pgClient`
				SELECT *
				FROM "user"
				WHERE id = ${userId}
			`;
			},
			{
				operation: "find user",
			},
		);

		if (!user) return null;

		return {
			id: user.id,
			username: user.email,
			email: user.email,
			passwordHash: user.passwordhash,
		};
	}

	async userExists(newUser: UserSignupDto): Promise<boolean> {
		const [user] = await this.executeDbOperation(
			async () => {
				return await this.pgClient`
					SELECT 1
					FROM "user"
					WHERE username = ${newUser.username} OR email = ${newUser.email}
				`;
			},
			{
				operation: "user exists",
			},
		);

		if (user) {
			return true;
		}

		return false;
	}

	async deleteAll(): Promise<void> {
		await this.pgClient`
			TRUNCATE TABLE "user"
		`;
	}
}
