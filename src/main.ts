import "dotenv/config";

import { UserLoginUseCase } from "@application/auth-use-cases/login-use-case";
import { LogoutUseCase } from "@application/auth-use-cases/logout-use-case";
import { SignupUseCase } from "@application/auth-use-cases/signup-use-case";
import { UserLoginController } from "@controllers/auth-controllers/login-controller";
import { UserLogoutController } from "@controllers/auth-controllers/logout-controller";
import { UserSignupController } from "@controllers/auth-controllers/signup-controller";
import { startDb } from "@infrastructure/repositories/postgresql/connection";
import { UserRepository } from "@infrastructure/repositories/postgresql/user-repository";
import { BcryptPwdHasher } from "@infrastructure/services/password-hasher/bcrypt-hasher";
import { startRedisSession } from "@infrastructure/services/session-stores/redis-store/connection";
import { RedisSession } from "@infrastructure/services/session-stores/redis-store/redis-session";
import initApp from "@infrastructure/web/fastify";
import { authRoutes } from "@infrastructure/web/fastify/routes/auth-routes";
import { PinoLogger } from "@infrastructure/web/shared/utils";

async function bootstrap() {
	const logger = await PinoLogger.createLog();

	try {
		const fastify = initApp(logger);
		const PORT = parseInt(process.env.PORT || "3000", 10);
		const sqlClient = await startDb();
		const { redisClient, sessionPrefix } = await startRedisSession();
		const userRepository = new UserRepository(sqlClient);
		const redisSession = new RedisSession(
			redisClient,
			sessionPrefix,
			userRepository,
		);
		const passwordHasher = new BcryptPwdHasher();
		const userSignupUseCase = new SignupUseCase(
			userRepository,
			redisSession,
			passwordHasher,
		);
		const userLoginUseCase = new UserLoginUseCase(
			userRepository,
			redisSession,
			passwordHasher,
		);
		const userLogoutUseCase = new LogoutUseCase(redisSession);
		const userSignupController = new UserSignupController(userSignupUseCase);
		const userLoginController = new UserLoginController(userLoginUseCase);
		const userLogoutController = new UserLogoutController(userLogoutUseCase);

		fastify.register(
			authRoutes({
				userSignupController,
				userLoginController,
				userLogoutController,
			}),
			{
				prefix: "/api/v1/auth",
			},
		);
		
		await fastify.listen({ port: PORT });
		logger.info(
			`server running on http://${fastify.addresses()[0].address}:${PORT}`,
		);
	} catch (error) {
		logger.error("Error happend while starting up server", {
			stack: error.stack,
			cause: error,
		});
		process.exit(1);
	}
}

bootstrap();
