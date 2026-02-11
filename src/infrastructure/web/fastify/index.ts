import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import Fastify from "fastify";

import { sessionCookieOptions } from "@configs";
import { pinoLogger } from "@shared/utils/logger";
import { globalErrorHandlerWrapper } from "./middlewares/error-handler";

export default async function init() {
	const logger = await pinoLogger;
	const fastify = Fastify();

	fastify.register(cors);
	fastify.register(helmet);
	fastify.register(cookie, {
		secret: sessionCookieOptions.secret,
	});

	fastify.addHook("onRequest", async (req, _) => {
		logger.info("request incoming", {
			requestId: req.id,
			url: req.url,
			method: req.method,
			body: req.body as unknown,
			query: req.query as string,
		});
	});

	fastify.setErrorHandler(globalErrorHandlerWrapper(logger));

	fastify.setNotFoundHandler((_, reply) => {
		reply
			.code(404)
			.type("text/plain")
			.send("Can't handle the request. Can't find the approriate api");
	});

	return fastify;
}
