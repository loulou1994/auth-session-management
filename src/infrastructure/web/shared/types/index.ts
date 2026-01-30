import type { UserLoginController } from "@controllers/auth-controllers/login-controller";
import type { UserLogoutController } from "@controllers/auth-controllers/logout-controller";
import type { UserSignupController } from "@controllers/auth-controllers/signup-controller";

export type LogMetadata = {
	timestamp?: string;
	requestId?: string;
	stack?: string | undefined;
	cause?: unknown;
	method?: string;
	url?: string;
	query?: string | undefined;
	body?: unknown | undefined;
};

export interface ILogger {
	info(message: string, meta?: LogMetadata): void;
	error(message: string, meta?: LogMetadata): void;
}

export type AuthControllers = {
	userSignupController: UserSignupController;
	userLoginController: UserLoginController;
	userLogoutController: UserLogoutController;
};

export type IFastifyRoutesDecorator<Deps, Framework> = (
	deps: Deps,
) => (webFrameworkIns: Framework, ...args: unknown[]) => void | Promise<void>;
