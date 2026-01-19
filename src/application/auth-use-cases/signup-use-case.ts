import { type UserSignupDto } from "@entities/user";
import type { IUseCase } from "@application/shared/types";
import type { IUserRepository } from "@application/repositories/user-repository";
import type {
  ISessionStore,
  SessionKey,
} from "@application/services/session-store";
import type { IPasswordHasher } from "@application/services/password-hasher";

export class SignupUseCase
  implements IUseCase<UserSignupDto, Promise<SessionKey>>
{
  private userRepository: IUserRepository;
  private sessionService: ISessionStore;
  private passwordHasher: IPasswordHasher;

  constructor(
    userRepository: IUserRepository,
    sessionService: ISessionStore,
    passwordHasher: IPasswordHasher
  ) {
    this.userRepository = userRepository;
    this.sessionService = sessionService;
    this.passwordHasher = passwordHasher;
  }

  async execute(user: UserSignupDto) {
    const hashedPassword = await this.passwordHasher.hash(user.password);
    const userId = await this.userRepository.createUser({
      ...user,
      password: hashedPassword,
    });
    return await this.sessionService.create(userId);
  }
}
