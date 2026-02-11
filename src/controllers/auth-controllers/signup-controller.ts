import z from "zod";

import type { SignupUseCase } from "@application/auth-use-cases/signup-use-case";
import { userSignUpSchema } from "@controllers/auth-controllers/validations";
import type {
	IController,
	TRequest,
	TResponse,
} from "@controllers/shared/types";
import { InputValidationError } from "@shared/types";

// type UserSignupInputDto = z.infer<typeof userSignUpSchema>;

export class UserSignupController implements IController {
	private signupUseCase: SignupUseCase;

	constructor(signupUseCase: SignupUseCase) {
		this.signupUseCase = signupUseCase;
	}

	async execute(req: TRequest): Promise<Required<TResponse>> {
		const result = userSignUpSchema.safeParse(req.body);

		if (result.success === false && result.error) {
			const error = result.error;
			const message = "Invalid input entries. Check your inputs";
			const errors = z.flattenError(error).fieldErrors;

			throw new InputValidationError(message, errors);
		}

		const { username, email, password } = result.data;
		const sessionId = await this.signupUseCase.execute({
			email,
			username,
			password,
		});

		return {
			statusCode: 201,
			cookies: sessionId,
			response: {
				success: true as const,
			},
		};
	}
}
