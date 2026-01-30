// biome-ignore-all lint/suspicious/noExplicitAny: gonna type check (validate) value within each method

import type {
	AuthControllers,
	IFastifyRoutesDecorator,
} from "@infrastructure/web/shared/types";
import type { FastifyInstance } from "fastify";
import { sessionCookieOptions } from "src/configs";

export const authRoutes: IFastifyRoutesDecorator<
	AuthControllers,
	FastifyInstance
> = (authControllers) => async (fastify) => {
	const { userSignupController, userLoginController, userLogoutController } =
		authControllers;
	const { cookieName, ...cookieConfig } = sessionCookieOptions;

	fastify.post("/signup", async (request, reply) => {
		const { body } = request;
		const { statusCode, cookies, response } =
			await userSignupController.execute({
				body: body as any,
			});

		reply.setCookie(cookieName, cookies[cookieName], {
			...cookieConfig,
			expires: new Date(Date.now() + cookieConfig.expires),
		});
		reply.code(statusCode).send(response);
	});

	fastify.post("/login", async (request, reply) => {
		const { body } = request;
		const { cookies, response, statusCode } = await userLoginController.execute(
			{
				body: body as any,
			},
		);

		reply.setCookie(cookieName, cookies.sid, {
			...cookieConfig,
			expires: new Date(Date.now() + cookieConfig.expires),
		});
		reply.code(statusCode).send(response);
	});

	fastify.post("/logout", async (request, reply) => {
		const { cookieName } = sessionCookieOptions;
		const sessionKey = request.cookies[cookieName];
		const { response, statusCode } = await userLogoutController.execute({
			cookies: { [cookieName]: sessionKey },
		});

		reply.code(statusCode).send(response);
	});
};
