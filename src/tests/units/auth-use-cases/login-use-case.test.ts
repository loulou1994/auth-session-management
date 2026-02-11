import { UserLoginUseCase } from "@application/auth-use-cases/login-use-case";
import {
	makeTestUser,
	passwordHasher,
	resetAllMocks,
	sessionKey,
	sessionService,
	userRepository,
} from "@tests/utils";

describe("login use case", () => {
	const loginUseCase = new UserLoginUseCase(
		userRepository,
		sessionService,
		passwordHasher,
	);
	beforeAll(() => {
		resetAllMocks();
	});

	it("creates a new session successfully", () => {
		const { id, username, pwdHash, ...userTest } = makeTestUser();
		userRepository.findEmail.mockResolvedValue({
			...userTest,
			id,
			username,
			password: pwdHash,
		});
		passwordHasher.compare.mockResolvedValue(true);
		sessionService.create.mockResolvedValue(sessionKey);

		expect(loginUseCase.execute(userTest)).resolves.toBe(sessionKey);
	});

	it("throws service error if email doesn't exist", () => {
		const { id, username, pwdHash, ...userTest } = makeTestUser();
		userRepository.findEmail.mockResolvedValue(null);

		expect(loginUseCase.execute(userTest)).rejects.toThrow(
			"Unknown email and/or incorrect password",
		);
	});

	it("throws service error if password doesn't match", () => {
		const { id, username, pwdHash, ...userTest } = makeTestUser();
		userRepository.findEmail.mockResolvedValue({
			...userTest,
			id,
			username,
			password: pwdHash,
		});
		passwordHasher.compare.mockResolvedValue(false);

		expect(loginUseCase.execute(userTest)).rejects.toThrow(
			"Unknown email and/or incorrect password",
		);
	});
});
