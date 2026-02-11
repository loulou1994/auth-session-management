import type { ApiSuccessResponse } from "@shared/types/index";

// type Cookies<T> = {
//     [P in keyof T]: T[P]
// }

export type TRequest = {
	body?: unknown;
	cookies?: Record<string, string | undefined>;
	queryParams?: Record<string, string>;
	queryString?: Record<string, string>;
};

export type TResponse<T = undefined> = {
	statusCode: number;
	response: ApiSuccessResponse<T>;
	cookies?: Record<string, string>;
	// errors?: Record<string, string[]>;
	// error?: string
};

export interface IController<O = undefined> {
	execute(input: TRequest): Promise<TResponse<O>>;
}
