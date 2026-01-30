type ApiResponse<T = undefined> = {
	success: boolean;
	data?: T;
	message?: string;
	error?: string;
	errors?: Record<string, string[]>;
};

export type ApiSuccessResponse<T> = Pick<ApiResponse<T>, "data" | "message"> & {
	success: true;
};

export type ApiErrorResponse = Pick<
	ApiResponse,
	"message" | "error" | "errors"
> & {
	success: false;
};

export class APIError extends Error {
	statusCode: number;
}

export class ServiceError extends APIError {
	cause: unknown;

	constructor(message: string, cause: unknown, statusCode: number = 500) {
		super(message);
		this.statusCode = statusCode;
		this.cause = cause;
	}
}

export class ValidationError extends APIError {
	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode
	}
}

export class InputValidationError extends APIError {
	errors: Record<string, string[]>;

	constructor(message: string, errors: Record<string, string[]>) {
		super(message);
		this.errors = errors;
		this.statusCode = 400;
	}
}

