type ApiResponse<T=undefined> = {
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

  constructor(message: string) {
    super(message);
  }
}

export class ServiceError extends APIError {
  cause: string;

  constructor(message: string, cause: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.cause = cause;
  }
}

export class InputValidationError extends APIError {
  errors: Record<string, any[]>;

  constructor(message: string, errors: Record<string, any[]>) {
    super(message);
    this.errors = errors;
    this.statusCode = 400;
  }
}