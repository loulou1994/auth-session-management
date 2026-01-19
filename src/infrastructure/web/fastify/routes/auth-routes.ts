import type { FastifyInstance } from "fastify";

import { sessionCookieOptions } from "src/configs";
import type {
  IFastifyRoutesDecorator,
  AuthControllers,
} from "@infrastructure/web/shared/types";

export const authRoutes: IFastifyRoutesDecorator<
  AuthControllers,
  FastifyInstance
> = function (authControllers) {
  return async function (fastify) {
    const { userSignupController } = authControllers;

    fastify.post("/signup", async (request, reply) => {
      const { body } = request;
      const { cookieName, ...cookieConfig } = sessionCookieOptions;
      const { statusCode, cookies, response } =
        await userSignupController.execute({
          body: body as any,
        });

      reply.setCookie(cookieName, cookies.sid, {
        ...cookieConfig,
        expires: new Date(Date.now() + cookieConfig.expires),
      });

      reply.code(statusCode).send(response);
    });
  };
};
