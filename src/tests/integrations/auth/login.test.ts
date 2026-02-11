import type { FastifyInstance } from "fastify";
import type postgres from "postgres";
import type { RedisClientType } from "redis";
import request from "supertest";

import { UserRepository } from "@infrastructure/repositories/postgresql/user-repository";
import { makeTestUser } from "@tests/utils";
import { bootstrap } from "src/app";

describe("POST /api/v1/auth/login", () => {
	let fastify: FastifyInstance;
	let redisCl: RedisClientType;
	let pg: postgres.Sql<Record<string, unknown>>;
	let userRepository: UserRepository;

	beforeAll(async () => {
		[fastify, pg, redisCl] = await bootstrap();
		userRepository = new UserRepository(pg);

		await fastify.ready();
	});

	afterAll(async () => {
		await pg.end();
		await redisCl.close();
	});

	beforeEach(async () => {
		await userRepository.deleteAll();
	});

	test("authenticates and creates new user session", async () => {
		const { id, username, pwdHash, ...userTest } = makeTestUser();
		await userRepository.createUser({
			...userTest,
			username,
			password: pwdHash,
		});

		const result = await request(fastify.server)
			.post("/api/v1/auth/login")
			.send({ ...userTest });

		expect(result.status).toBe(200);
		expect(result.headers["set-cookie"]).toBeDefined();
	});

	test("returns an error response due to invalid user inputs", async () => {
		const result = await request(fastify.server)
			.post("/api/v1/auth/login")
			.send({ email: "nothingwronginput@" });

		expect(result.status).toBe(400);
		expect(result.body.errors).toBeDefined();
	});
});
