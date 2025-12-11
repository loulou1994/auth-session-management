import type { FastifyInstance } from "fastify";
import type { AuthControllers, IRouteModule } from "../shared/types/index.ts";

export const authRoutes: IRouteModule<AuthControllers, FastifyInstance> =
  function (authControllers) {
    return async function (fastify) {
      const { userSignupController } = authControllers;

      fastify.post("/auth/login", async (request, reply) => {
        const { body } = request;
        const { statusCode, error, errors, message } =
          await userSignupController.execute({
            body: body as any,
          });

        reply.code(statusCode).send({ error, errors, message });
      });
    };
  };
