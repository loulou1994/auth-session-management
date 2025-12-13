export type UserSignup = {
    username: string;
    email: string;
    password: string
    passwordConfirm: string
}

export interface ILogger {
    info(message: string, meta: Record<string, any>): void
}