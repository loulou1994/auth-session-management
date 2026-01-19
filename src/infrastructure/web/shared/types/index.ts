import { UserSignupController } from "@controllers/auth-controllers/signup-controller"; 

export type LogMetadata = {
    timestamp?: string;
    requestId?: string; 
    stack?: string | undefined;
    cause?: any
    method?: string;
    url?: string
    query?: string | undefined,
    body?: Record<string, any> | undefined
}

export interface ILogger {
    info(message: string, meta?: LogMetadata): void
    error(message: string, meta?: LogMetadata): void
}

export type AuthControllers = {
  userSignupController: UserSignupController;
};

export interface IFastifyRoutesDecorator<Deps, Framework> {
  (deps: Deps): (
    webFrameworkIns: Framework,
    ...args: any[]
  ) => void | Promise<void>;
}