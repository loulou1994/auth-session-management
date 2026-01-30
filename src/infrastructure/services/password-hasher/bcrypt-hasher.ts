import type { IPasswordHasher } from "@application/services/password-hasher";
import { createServiceError } from "@shared/utils";
import bcrypt from "bcrypt";

export class BcryptPwdHasher implements IPasswordHasher {
	private static readonly saltRounds = 10;

	async hash(plain: string) {
		try {
			return await bcrypt.hash(plain, BcryptPwdHasher.saltRounds);
		} catch (err) {
			throw createServiceError("Couldn't register user", err);
		}
	}

	async compare(hashedPwd: string, password: string): Promise<void> {
		try {
			await bcrypt.compare(password, hashedPwd);
		} catch (err) {
			throw createServiceError(
				"Unknown email and/or incorrect password",
				err,
				401,
			);
		}
	}
}
