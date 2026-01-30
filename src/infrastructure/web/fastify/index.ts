import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";

import type { PinoLogger } from "@infrastructure/web/shared/utils/index";
import Fastify from "fastify";
import { globalErrorHandlerWrapper } from "./middlewares/error-handler";

export default function init(logger: PinoLogger) {
	const fastify = Fastify();

	fastify.register(cors);
	fastify.register(helmet);
	fastify.register(cookie, {
		secret: process.env.SESSION_COOKIE_SECRET,
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
		reply.code(404).type("text/plain").send("Can't handle the request. Can't find the approriate api");
	});

	return fastify;
}
