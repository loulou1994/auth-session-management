import z from "zod";

import type { UserLoginUseCase } from "@application/auth-use-cases/login-use-case";
import { userLoginSchema } from "@controllers/auth-controllers/validations";
import type {
	IController,
	TRequest,
	TResponse,
} from "@controllers/shared/types";
import { InputValidationError } from "@shared/types";

// type UserLoginInputDto = z.infer<typeof userLoginSchema>;

export class UserLoginController implements IController {
	private loginUseCase: UserLoginUseCase;

	constructor(loginUseCase: UserLoginUseCase) {
		this.loginUseCase = loginUseCase;
	}

	async execute(input: TRequest): Promise<Required<TResponse>> {
		const result = userLoginSchema.safeParse(input.body);

		if (result.success === false) {
			const error = result.error;
			const message = "Invalid input entries. Check your inputs";
			const errors = z.flattenError(error).fieldErrors;

			throw new InputValidationError(message, errors);
		}

		const sessionId = await this.loginUseCase.execute(result.data);
		
		return {
			statusCode: 200,
			response: {
				success: true,
			},
			cookies: sessionId,
		};
	}
}
