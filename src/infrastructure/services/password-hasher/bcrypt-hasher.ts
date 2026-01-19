import bcrypt from "bcrypt";
import type { IPasswordHasher } from "@application/services/password-hasher";
import { createErrorService } from "@shared/utils";

export class BcryptPwdHasher implements IPasswordHasher {
  private static readonly saltRounds = 10;

  constructor() {}

  async hash(plain: string) {
    try {
      return await bcrypt.hash(plain, BcryptPwdHasher.saltRounds);
    } catch (err) {
      throw createErrorService("Couldn't register user", err);
    }
  }
}
