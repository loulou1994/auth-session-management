import crypto from "crypto";
import type { RedisClientType } from "redis";

import type {
  ISessionStore,
  SessionData,
  SessionKey,
} from "@application/services/session-store";
import { createErrorService } from "@shared/utils";

export class RedisSession implements ISessionStore {
  static readonly ABSOLUTE_TIMEOUT = 60 * 60 * 24 * 7; // timeouts in seconds
  static readonly IDLE_TIMEOUT = 60 * 15;

  private redisClient: RedisClientType;
  private sessionPrefix: string;

  constructor(redisClient: RedisClientType, sessionPrefix: string) {
    this.redisClient = redisClient;
    this.sessionPrefix = sessionPrefix;
  }

  async create(userId: string): Promise<SessionKey> {
    // generate crypto-secure pseudo-random session key
    try {
      const sessionId = crypto.randomBytes(16).toString("hex");
      const sessionKey = `${this.sessionPrefix}:${sessionId}`;
      const sessionData: SessionData = { userId, createdAt: Date.now() / 1000 };

      await this.redisClient.hSet(sessionKey, sessionData);
      await this.redisClient.expire(sessionKey, RedisSession.IDLE_TIMEOUT);
      return { sid: sessionId };
      
    } catch (err) {
      throw createErrorService(
        "User created. But an error has occured when initiating a new session.",
        err
      );
    }
  }

  // private getSessionPrefix(sessionId: string): string {
  //   return `${this.sessionPrefix}:${sessionId}`;
  // }
}
