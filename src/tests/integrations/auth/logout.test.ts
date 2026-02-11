import type { RedisClientType } from "@redis/client";
import type { FastifyInstance } from "fastify";
import type postgres from "postgres";
import request from "supertest";

import { UserRepository } from "@infrastructure/repositories/postgresql/user-repository";
import { makeTestUser } from "@tests/utils";
import { bootstrap } from "src/app";

describe("POST /api/v1/auth/logout", () => {
	let fastify: FastifyInstance;
	let pg: postgres.Sql<Record<string, unknown>>;
	let userRepository: UserRepository;
	let redisCli: RedisClientType;

	beforeAll(async () => {
		[fastify, pg, redisCli] = await bootstrap();
		userRepository = new UserRepository(pg);

		await fastify.ready();
	});

	afterAll(async () => {
		await pg.end();
		await redisCli.close();
	});

	beforeEach(async () => {
		await userRepository.deleteAll();
	});

	it("logs out a logged-in user", async () => {
		const { id, username, pwdHash, ...userTest } = makeTestUser();

		await userRepository.createUser({
			...userTest,
			username,
			password: pwdHash,
		});

		const agent = request.agent(fastify.server);

		const cookies = (await agent.post("/api/v1/auth/login").send(userTest))
			.headers["set-cookie"];

		const result = await agent
			.post("/api/v1/auth/logout")
			.set("Cookie", cookies);

		expect(result.statusCode).toBe(200);
		expect(result.headers["set-cookie"]).toEqual(
			expect.arrayContaining([
				"sid=; Max-Age=0; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax",
			]),
		);
	});

	it("returns an error response due to invalid session", async () => {
		const result = await request.agent(fastify.server).post("/api/v1/auth/logout")

		expect(result.statusCode).toBe(401)
		expect(result.body?.error).toBeDefined()
	})
});
