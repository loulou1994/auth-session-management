import { createClient } from "redis";

import { sessionDbConfig } from "@configs";

export async function startRedisSession() {
	const redisClient = await createClient({
		url: `redis://${sessionDbConfig.username}:${sessionDbConfig.password}@${sessionDbConfig.hostname}:${sessionDbConfig.port}`,
		RESP: 2,
	}).connect();

	return { redisClient, sessionPrefix: sessionDbConfig.sessionPrefix };
}
