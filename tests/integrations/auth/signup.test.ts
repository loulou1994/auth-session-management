import type { FastifyInstance } from "fastify";
import type postgres from "postgres";
import request from "supertest";

import { startDb } from "../../../src/infrastructure/repositories/postgresql/connection";
import { UserRepository } from "../../../src/infrastructure/repositories/postgresql/user-repository";
import initApp from "../../../src/infrastructure/web/fastify/index";
import { PinoLogger } from "../../../src/infrastructure/web/shared/utils/index";
import { userTest } from "../../utils";

describe("POST /api/v1/auth/signup", () => {
	let app: FastifyInstance;
	let pg: postgres.Sql<Record<string, unknown>>;
	let userRepository: UserRepository;

	beforeEach(async () => {
		app = initApp(await PinoLogger.createLog());
		pg = await startDb();
		userRepository = new UserRepository(pg);

		await userRepository.deleteAll();
		await app.ready();
	});

	afterEach(async () => {
		await pg.end();
	});

	it("creates a new user", async () => {
		const result = await request(app.server)
			.post("/api/v1/auth/signup")
			.send({...userTest, passwordConfirm: "loulou478-"});

		expect(result.status).toBe(200);
		expect(result.body.response).toBeUndefined();
		expect(result.headers["set-cookie"]).toBeDefined();

		const addedUser = await userRepository.findEmail(userTest.email);

		expect(addedUser).not.toBeNull();
		expect(addedUser?.passwordHash).not.toBe(userTest.password);
	});
});
