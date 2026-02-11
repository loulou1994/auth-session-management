import { ServiceError } from "../shared/types/index";

export const userRepository = {
	findEmail: jest.fn(),
	createUser: jest.fn(),
	findUnique: jest.fn(),
	userExists: jest.fn(),
	deleteAll: jest.fn(),
};

export const passwordHasher = {
	compare: jest.fn(),
	hash: jest.fn(),
};

export const sessionService = {
	create: jest.fn(),
	validate: jest.fn(),
	revoke: jest.fn(),
	refresh: jest.fn(),
};

export function makeTestUser() {
	const randomId = crypto.randomUUID();

	return {
		id: randomId,
		username: `test-user${randomId.slice(-5)}`,
		email: `test-user${randomId.slice(-5)}@test.co`,
		password: "louLou9209",
		pwdHash: "$2b$10$AMjcyK/JTmfPL7xdmnih2Ol4MIWPHMHf6SZis2muIYXUudqf42tU.",
	};
}

export const sessionKey = {
	sid: crypto.randomUUID(),
};

export async function expectServiceError(
	asyncFn: () => Promise<unknown>,
	expectMessage: string,
	expectStatus: number,
) {
	try {
		await asyncFn();
		throw new Error("Expected the function to throw a service error");
	} catch (err) {
		if (err instanceof ServiceError) {
			expect(err).toBeInstanceOf(ServiceError);
			expect(err.message).toBe(expectMessage);
			expect(err.statusCode).toBe(expectStatus);
			return;
		}

		throw err;
	}
}

export function resetAllMocks() {
	Object.values(userRepository).forEach((fn) => {
		fn.mockReset();
	});

	Object.values(passwordHasher).forEach((fn) => {
		fn.mockReset();
	});
}
