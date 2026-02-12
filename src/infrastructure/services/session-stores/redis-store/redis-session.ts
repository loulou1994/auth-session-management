import crypto from "node:crypto";
import type { RedisClientType } from "redis";

import type { IUserRepository } from "@application/repositories/user-repository";
import type {
	ISessionStore,
	SessionData,
	SessionKey,
} from "@application/services/session-store";
import { ServiceError } from "@shared/types";
import { createServiceError } from "@shared/utils";

export class RedisSession implements ISessionStore {
	private static readonly absoluteTimeout = 60 * 60 * 24 * 7; // 7d in secs
	private static readonly idleTimeout = 60 * 15; // 15mins in secs

	private redisClient: RedisClientType;
	private sessionPrefix: string;
	private userRepository: IUserRepository;

	constructor(
		redisClient: RedisClientType,
		sessionPrefix: string,
		userRespository: IUserRepository,
	) {
		this.redisClient = redisClient;
		this.sessionPrefix = sessionPrefix;
		this.userRepository = userRespository;
	}

	async create(userId: string): Promise<SessionKey> {
		// generate crypto-secure pseudo-random session key
		try {
			const sessionId = crypto.randomBytes(16).toString("hex");
			const sessionKey = `${this.sessionPrefix}${sessionId}`;
			const sessionData: SessionData = { userId, createdAt: Date.now() / 1000 };

			await this.redisClient.hSet(sessionKey, sessionData);
			await this.redisClient.expire(sessionKey, RedisSession.idleTimeout);

			return { sid: sessionId };
		} catch (err) {
			throw createServiceError(
				"The user was created but an error occured while initiating a new session.",
				err,
			);
		}
	}

	async validate(sessionKey: SessionKey): Promise<void> {
		const sessionId = `${this.sessionPrefix}${sessionKey.sid}`;

		try {
			const userSession = (await this.redisClient.hGetAll(
				sessionId,
			)) as unknown as SessionData | Record<string, string>;
			
			if (!("userId" in userSession)) {
				throw createServiceError("User not authenticated", null, 401);
			}

			const user = await this.userRepository.findUnique(userSession.userId);

			// console.log(user)
			if (!user) {
				await this.revoke({ sid: sessionId });
				throw createServiceError("User does not exist", null, 400);
			}
		} catch (err) {
			if (err instanceof ServiceError) {
				throw err;
			}

			throw createServiceError(
				"Unexpected error occured while validating session",
				err,
			);
		}
	}

	async revoke(sessionKey: SessionKey): Promise<void> {
		await this.redisClient.del(`${this.sessionPrefix}${sessionKey.sid}`);
	}

	async refresh(sessionKey: SessionKey): Promise<SessionKey | undefined> {
		const sessionId = `${this.sessionPrefix}${sessionKey.sid}`;
		const userSession = (await this.redisClient.hGetAll(
			sessionId,
		)) as unknown as SessionData;
		const expirationTime = userSession.createdAt + RedisSession.absoluteTimeout;
		const aDayBeforeExpiryTime = expirationTime - 60 * 60 * 24; // a day before exp in secs
		const currentTime = Date.now() / 1000;

		if (currentTime >= aDayBeforeExpiryTime && currentTime < expirationTime) {
			// await this.redisClient.hSet(sessionId, "createdAt", Date.now() / 1000);
			return await this.create(userSession.userId)
		}

		await this.redisClient.expire(sessionId, RedisSession.idleTimeout);
	}
	// private getSessionPrefix(sessionId: string): string {
	//   return `${this.sessionPrefix}:${sessionId}`;
	// }
}
