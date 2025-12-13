export type TRequest<T> = {
    body?: T;
    cookies?: Record<string, string>
    queryParams?: Record<string, string>
    queryString?: Record<string, string>
}

export type TResponse = {
    statusCode: number,
    message?: string;
    data?: string;
    cookies?: Record<string, string>;
    errors?: Record<string, string[]>;
    error?: string
}

export interface IController<T> {
    execute(input: TRequest<T>): Promise<TResponse>
}