import z from "zod";

import type {
  IController,
  TRequest,
  TResponse,
} from "../shared/types/index.ts";
import { SignupUseCase } from "../../application/auth-use-cases/signup-use-case.ts";

const userSignUpSchema = z
  .object({
    username: z.string().regex(/^[a-zA-Z0-9_-]{3,15}$/),
    email: z.email(),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+}{":;'\[\]]{8,}$/
      ),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Password do not match",
    path: ["passwordConfirm"],
  });

type UserSignup = z.infer<typeof userSignUpSchema>;

export class UserSignupController implements IController<UserSignup> {
  private signupUseCase: SignupUseCase;

  constructor(signupUseCase: SignupUseCase) {
    this.signupUseCase = signupUseCase;
  }

  async execute(req: TRequest<UserSignup>): Promise<TResponse> {
    const isValidUser = userSignUpSchema.safeParse(req.body);

    if (!isValidUser.success || !req.body) {
      const error = isValidUser.error!;

      return {
        statusCode: 400,
        message: z.prettifyError(error),
        errors: z.flattenError(error).fieldErrors,
      };
    }

    const newUser = await this.signupUseCase.execute(req.body);

    return {
      statusCode: 201,
      message: "User signed up successfully!",
    };
  }
}
