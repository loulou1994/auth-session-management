type TRequest = {
    body: Record<string, unknown>;
    cookies: Record<string, string>
    parameters?: Record<string, string>
}

type TResponse = {
    statusCode: number,
    message?: string;
    data?: string;
    cookies?: Record<string, string>;
}

export interface IController {
    execute: (request: TRequest) => TResponse
}