// biome-ignore-all lint/suspicious/noExplicitAny: gonna type check (validate) value within each method

import type { FastifyInstance } from "fastify";

import { sessionCookieOptions } from "@configs";
import type {
	AuthControllers,
	IFastifyRoutesDecorator,
} from "@infrastructure/web/shared/types";

export const authRoutes: IFastifyRoutesDecorator<
	AuthControllers,
	FastifyInstance
> = (authControllers) => async (fastify) => {
	const { userSignupController, userLoginController, userLogoutController } =
		authControllers;
	const { cookieName, secret, ...cookieConfig } = sessionCookieOptions;

	fastify.post("/signup", async (request, reply) => {
		const { body } = request;
		const { statusCode, cookies, response } =
			await userSignupController.execute({
				body: body as any,
			});

		reply.setCookie(cookieName, cookies[cookieName], {
			...cookieConfig,
			expires: new Date(Date.now() + cookieConfig.expires),
			signed: true,
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
			signed: true,
		});
		reply.code(statusCode).send(response);
	});

	fastify.post("/logout", async (request, reply) => {
		const sessionKey = request.unsignCookie(request.cookies[cookieName] || "");

		const { response, statusCode } = await userLogoutController.execute({
			cookies: { [cookieName]: sessionKey.valid ? sessionKey.value : "false" },
		});

		reply.clearCookie(cookieName);

		reply.code(statusCode).send(response);
	});
};
