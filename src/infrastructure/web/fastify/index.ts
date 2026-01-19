import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import cookie from "@fastify/cookie";

import { PinoLogger } from "@infrastructure/web/shared/utils/index";
import { globalErrorHandlerWrapper } from "./middlewares/error-handler";

export default function init (logger: PinoLogger) {
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
      body: req.body as Record<string, any> | undefined,
      query: req.query as string,
    });
  });

  fastify.setErrorHandler(globalErrorHandlerWrapper(logger));

  fastify.setNotFoundHandler((_, reply) => {
    reply.code(404).type("text/plain").send("A custom not found");
  });

  return fastify
  // return {
  //   fastify,
  //   listen(port: number) {
  //     fastify.listen({ port }, (err, addr) => {
  //       if (err instanceof Error) {
  //         logger.error(`Couldn't start up server`, {
  //           stack: err.stack ?? "",
  //         });
  //         process.exit(1);
  //       }

  //       logger.info(`Server running at ${addr}, port: ${port}`);
  //     });
  //   },
  // };
};
