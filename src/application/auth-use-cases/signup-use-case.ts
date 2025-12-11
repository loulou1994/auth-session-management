import type { IUseCase } from "../shared/index.ts";
import type { UserSignup } from "../../shared/types.ts";
import type { User } from "../../entities/user.ts";
import type { IUserRepository } from "../interfaces/user-repository.ts";

export class SignupUseCase implements IUseCase<UserSignup, Promise<User>> {  
  private userRepository: IUserRepository
  
  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async execute(newUser: UserSignup): Promise<User> {
    return this.userRepository.createUser(newUser)
  }
}
