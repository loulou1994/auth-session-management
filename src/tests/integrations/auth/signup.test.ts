import type { FastifyInstance } from "fastify";
import type postgres from "postgres";
import type { RedisClientType } from "redis";
import request from "supertest";

import { UserRepository } from "@infrastructure/repositories/postgresql/user-repository";
import { makeTestUser } from "@tests/utils";
import { bootstrap } from "src/app";

describe("POST /api/v1/auth/signup", () => {
	let fastify: FastifyInstance;
	let pg: postgres.Sql<Record<string, unknown>>;
	let userRepository: UserRepository;
	let redisCl: RedisClientType;

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

	it("creates a new user", async () => {
		const { id, username, pwdHash, ...userTest } = makeTestUser();
		const result = await request(fastify.server)
			.post("/api/v1/auth/signup")
			.send({ ...userTest, passwordConfirm: userTest.password, username });

		expect(result.status).toBe(201);
		expect(result.body.response).toBeUndefined();
		expect(result.headers["set-cookie"]).toBeDefined();

		const addedUser = await userRepository.findEmail(userTest.email);

		expect(addedUser).not.toBeNull();
		expect(addedUser?.passwordHash).not.toBe(userTest.password);
	});

	it("returns an error response due to duplicate user (username or email)", async () => {
		const { id, username, pwdHash, ...userTest } = makeTestUser();

		await userRepository.createUser({
			...userTest,
			password: pwdHash,
			username,
		});

		const result = await request(fastify.server)
			.post("/api/v1/auth/signup")
			.send({ ...userTest, passwordConfirm: userTest.password, username });

		expect(result.status).toBe(409);
		expect(result.body).toBeDefined();
		expect(result.body.error).toBe("User already exists");
	});

	it("returns an error response due to invalid user input", async () => {
		const result = await request(fastify.server)
			.post("/api/v1/auth/signup")
			.send({
				username: "lo",
				email: "maybe-19@gmal.co",
				password: "falsePwd",
				passwordConfirm: "louLou9209",
			});

		expect(result.status).toBe(400);
		expect(result.body).toBeDefined();
		expect(result.body.errors).toBeDefined();
	});
});
