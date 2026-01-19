import z from "zod";
import type {
  IController,
  TRequest,
  TResponse,
} from "@controllers/shared/types";
import { SignupUseCase } from "@application/auth-use-cases/signup-use-case";
import { InputValidationError } from "@shared/types";
import { userSignUpSchema } from "./validations";

type UserSignupInputDto = {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export class UserSignupController
  implements IController<UserSignupInputDto, undefined>
{
  private signupUseCase: SignupUseCase;

  constructor(signupUseCase: SignupUseCase) {
    this.signupUseCase = signupUseCase;
  }

  async execute(
    req: TRequest<UserSignupInputDto>
  ): Promise<Required<TResponse<undefined>>> {
    const isValidUser = userSignUpSchema.safeParse(req.body);

    if (isValidUser.success === false && isValidUser.error) {
      const error = isValidUser.error;
      const message = "Invalid input entries. Enter correct input values";
      const errors = z.flattenError(error).fieldErrors;

      throw new InputValidationError(message, errors);
    }

    const sessionId = await this.signupUseCase.execute(isValidUser.data);

    return {
      statusCode: 204,
      cookies: sessionId,
      response: {
        success: true as const,
        message: "User added successfully"
      },
    };
  }
}
