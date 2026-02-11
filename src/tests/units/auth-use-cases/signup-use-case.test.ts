import { SignupUseCase } from "@application/auth-use-cases/signup-use-case";
import {
	expectServiceError,
	makeTestUser,
	passwordHasher,
	resetAllMocks,
	sessionKey,
	sessionService,
	userRepository,
} from "@tests/utils";

describe("test signup use case", () => {
	const signupUseCase = new SignupUseCase(
		userRepository,
		sessionService,
		passwordHasher,
	);

	beforeAll(() => {
		resetAllMocks();
	});

	it("creates a new user & session successfully", async () => {
		const { id, username, pwdHash, ...userTest } = makeTestUser();
		userRepository.userExists.mockResolvedValue(false);
		userRepository.createUser.mockResolvedValue(id);
		passwordHasher.hash.mockResolvedValue(pwdHash);
		sessionService.create.mockResolvedValue(sessionKey);

		const result = await signupUseCase.execute({
			...userTest,
			username,
		});

		expect(userRepository.userExists).toHaveBeenCalledWith({
			...userTest,
			username,
		});
		expect(passwordHasher.hash).toHaveBeenCalledWith(userTest.password);
		expect(userRepository.createUser).toHaveBeenCalledWith({
			...userTest,
			password: pwdHash,
			username,
		});
		expect(sessionService.create).toHaveBeenCalledWith(id);

		expect(result).toBe(sessionKey);
	});

	it("throws a service error if either username or email exist", async () => {
		const { id, username, pwdHash, ...userTest } = makeTestUser();
		userRepository.userExists.mockResolvedValue(true);

		await expectServiceError(
			async () => await signupUseCase.execute({ ...userTest, username }),
			"User already exists",
			409,
		);

		expect(userRepository.userExists).toHaveBeenCalledWith({
			...userTest,
			username,
		});
	});
});
