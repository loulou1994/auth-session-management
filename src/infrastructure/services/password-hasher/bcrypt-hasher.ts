import bcrypt from "bcrypt";

import type { IPasswordHasher } from "@application/services/password-hasher";
import { createServiceError } from "@shared/utils";

export class BcryptPwdHasher implements IPasswordHasher {
	private static readonly saltRounds = 10;

	async hash(plain: string) {
		try {
			return await bcrypt.hash(plain, BcryptPwdHasher.saltRounds);
		} catch (err) {
			throw createServiceError("Couldn't register user", err);
		}
	}

	async compare(hashedPwd: string, password: string): Promise<boolean> {
		try {
			return await bcrypt.compare(password, hashedPwd);
		} catch (err) {
			throw createServiceError(
				"Unexpected error happened while processing your password",
				err,
				500,
			);
		}
	}
}
