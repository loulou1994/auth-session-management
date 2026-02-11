import type { LogoutUseCase } from "@application/auth-use-cases/logout-use-case";
import type {
	IController,
	TRequest,
	TResponse,
} from "@controllers/shared/types";
import { ValidationError } from "@shared/types";
import { sessionCookieSchema } from "./validations";

export class UserLogoutController implements IController {
	private logoutUseCase: LogoutUseCase;

	constructor(logoutUseCase: LogoutUseCase) {
		this.logoutUseCase = logoutUseCase;
	}

	async execute(req: TRequest): Promise<TResponse> {
		const result = sessionCookieSchema.safeParse(req.cookies);

		// console.log(req.cookies)
		if (result.success === false) {
			const message = "You do not have an active session";
			throw new ValidationError(message, 401);
		}

		await this.logoutUseCase.execute(result.data);

		return {
			response: {
				success: true,
			},
			statusCode: 200,
		};
	}
}
