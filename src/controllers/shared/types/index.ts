import type { ApiSuccessResponse } from "@shared/types/index";

// type Cookies<T> = {
//     [P in keyof T]: T[P]
// }

export type TRequest<T> = {
    body?: T;
    cookies?: Record<string, string>
    queryParams?: Record<string, string>
    queryString?: Record<string, string>
}

export type TResponse<T> = {
    statusCode: number,
    response: ApiSuccessResponse<T>
    cookies?: Record<string, string>;
    // errors?: Record<string, string[]>;
    // error?: string
}

export interface IController<I, O> {
    execute(input: TRequest<I>): Promise<TResponse<O>>
}