import "dotenv/config";

import initApp from "@infrastructure/web/fastify";
import { UserRepository } from "@infrastructure/repositories/postgresql/user-repository";
import { RedisSession } from "@infrastructure/services/session-stores/redis-store/redis-session";
import { SignupUseCase } from "@application/auth-use-cases/signup-use-case";
import { UserSignupController } from "@controllers/auth-controllers/signup-controller";
import { authRoutes } from "@infrastructure/web/fastify/routes/auth-routes";
import { startDb } from "@infrastructure/repositories/postgresql/connection";
import { startRedisSession } from "@infrastructure/services/session-stores/redis-store/connection";
import { BcryptPwdHasher } from "@infrastructure/services/password-hasher/bcrypt-hasher";
import { PinoLogger } from "@infrastructure/web/shared/utils";

async function bootstrap() {
  const logger = await PinoLogger.createLog();

  try {
    const fastify = initApp(logger);
    const PORT = parseInt(process.env.PORT || "3000");
    const sqlClient = await startDb();
    const { redisClient, sessionPrefix } = await startRedisSession();
    const userRepository = new UserRepository(sqlClient);
    const redisSession = new RedisSession(redisClient, sessionPrefix);
    const passwordHasher = new BcryptPwdHasher();
    const userSignupUseCase = new SignupUseCase(
      userRepository,
      redisSession,
      passwordHasher,
    );
    const userSignupController = new UserSignupController(userSignupUseCase);
    fastify.register(authRoutes({ userSignupController }), {
      prefix: "/api/v1/auth",
    });

    await fastify.listen({ port: PORT });
    logger.info(`server running on http://${fastify.addresses()[0].address}:${PORT}`);
  } catch (error) {
    logger.error("Error happend while starting up server", {
      stack: error.stack,
      cause: error,
    });
    process.exit(1);
  }
}

bootstrap();
