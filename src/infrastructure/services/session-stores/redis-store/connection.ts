import { createClient } from "redis";
import { sessionConfig } from "src/configs";

export async function startRedisSession() {
  const redisClient = await createClient({
    url: `redis://${sessionConfig.username}:${sessionConfig.password}@${sessionConfig.hostname}:${sessionConfig.port}`,
    RESP: 2,
  }).connect();

  return { redisClient, sessionPrefix: sessionConfig.sessionPrefix };
}
