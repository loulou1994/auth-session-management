import { IUseCase } from "../shared/iuse-case.ts";
import { IUserRepository } from "../interfaces/user-repository.ts";
import { User } from "../../entities/user.ts";

type UserSignupDto = Pick<User, "username" | "email"> & { password: string };

export class SignupUseCase implements IUseCase<UserSignupDto> {
  constructor(private userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  execute(newUser: UserSignupDto) {
    return this.userRepository.createUser(newUser);
  }
}
