import { SignupUseCase } from "../../../src/application/auth-use-cases/signup-use-case";
import {
	expectServiceError,
	passwordHasher,
	resetAllMocks,
	sessionKey,
	sessionService,
	userRepository,
	userTest,
} from "../../utils";

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
		const hashedPwd = `orhjzluedn5d${userTest.password}pziejfdqdsq4687po12`;

		userRepository.userExists.mockResolvedValue(false);
		userRepository.createUser.mockResolvedValue(100);
		passwordHasher.hash.mockResolvedValue(hashedPwd);
		sessionService.create.mockResolvedValue(sessionKey);

		const result = await signupUseCase.execute(userTest);

		expect(userRepository.userExists).toHaveBeenCalledWith(userTest);
		expect(passwordHasher.hash).toHaveBeenCalledWith(userTest.password);
		expect(userRepository.createUser).toHaveBeenCalledWith({
			...userTest,
			password: hashedPwd,
		});
		expect(sessionService.create).toHaveBeenCalledWith(100);

		expect(result).toBe(sessionKey);
	});

	it("throws a service error if either username or email exist", async () => {
		userRepository.userExists.mockResolvedValue(true);

		await expectServiceError(
			async () => await signupUseCase.execute(userTest),
			"User already exists",
			400,
		);

		expect(userRepository.userExists).toHaveBeenCalledWith(userTest);
	});
});
