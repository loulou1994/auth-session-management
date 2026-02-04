import { UserLoginUseCase } from "../../../src/application/auth-use-cases/login-use-case";
import {
	passwordHasher,
	resetAllMocks,
	sessionKey,
	sessionService,
	userRepository,
	userTest,
} from "../../utils";

describe("login use case", () => {
	const loginUseCase = new UserLoginUseCase(
		userRepository,
		sessionService,
		passwordHasher,
	);
	const { username, ...user } = userTest;
	beforeAll(() => {
		resetAllMocks();
	});

	it("creates a new session successfully", () => {
		userRepository.findEmail.mockResolvedValue(user.email);
		passwordHasher.compare.mockResolvedValue(true);
		sessionService.create.mockResolvedValue(sessionKey);

		expect(loginUseCase.execute(user)).resolves.toBe(sessionKey);
	});

	it("throws service error if email doesn't exist", () => {
		userRepository.findEmail.mockResolvedValue(null);

		expect(loginUseCase.execute(user)).rejects.toThrow(
			"Unknown email and/or incorrect password",
		);
	});

	it("throws service error if password doesn't match", () => {
		userRepository.findEmail.mockResolvedValue(userTest);
		passwordHasher.compare.mockResolvedValue(false);

		expect(loginUseCase.execute(user)).rejects.toThrow(
			"Unknown email and/or incorrect password",
		);
	});
});
