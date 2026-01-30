import type { IPasswordHasher } from "@application/services/password-hasher";
import type { IUserRepository } from "@application/repositories/user-repository";
import type {
	ISessionStore,
	SessionKey,
} from "@application/services/session-store";
import type { IUseCase } from "@application/shared/types";
import type { UserLoginDto } from "@entities/user";
import { createServiceError } from "@shared/utils";

export class UserLoginUseCase
	implements IUseCase<UserLoginDto, Promise<SessionKey>>
{
	private userRepository: IUserRepository;
	private sessionService: ISessionStore;
	private passwordHasher: IPasswordHasher;

	constructor(	
		userRepository: IUserRepository,
		sessionService: ISessionStore,
		passwordHasher: IPasswordHasher,
	) {
		this.userRepository = userRepository;
		this.sessionService = sessionService;
		this.passwordHasher = passwordHasher;
	}

	async execute(inputUser: UserLoginDto) {
		const user = await this.userRepository.findEmail(inputUser);

		if (user === null) {
			throw createServiceError(
				"Unknown email and/or incorrect password",
				undefined,
				401,
			);
		}

		await this.passwordHasher.compare(user.passwordHash, inputUser.password);

		return await this.sessionService.create(user.id);
	}
}
