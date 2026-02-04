import { ServiceError } from "../src/shared/types/index";

export const userRepository = {
	findEmail: jest.fn(),
	createUser: jest.fn(),
	findUnique: jest.fn(),
	userExists: jest.fn(),
	deleteAll: jest.fn()
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

export const userTest = {
	// id: 0o1,
	username: "test-user",
	email: "test-email@test.co",
	password: "loulou478-",
};

export const sessionKey = {
	sid: "randomelygeneratedtestkey",
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
