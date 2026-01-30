import { APIError } from "@shared/types";

export class RepositoryError extends APIError {
	constructor(message: string, cause?: unknown) {
		super(message);
		this.cause = cause;
		this.statusCode = 500;
	}

	// toLogMetada() {
	//   return {
	//     stack: this.stack,
	//     cause: this.cause
	//   };
	// }
}

export class DuplicateEntityError extends RepositoryError {
	constructor(field: string, cause?: unknown) {
		super(`${field[0].toUpperCase()}${field.slice(1)} already exists`, cause);
		this.statusCode = 409;
	}
}

export class DatabaseConnectionError extends RepositoryError {
	constructor(cause?: unknown) {
		super("Failed to establish a database connection", cause);
		this.statusCode = 503;
	}
}

export class DatabaseTimeoutError extends RepositoryError {
	constructor(operation: string, cause?: unknown) {
		super(`${operation} database operation timed out`, cause);
		this.statusCode = 504;
	}
}

export class ConstraintViolationError extends RepositoryError {
	constructor(constraint: string, cause?: unknown) {
		super(`Database constraint ${constraint} violated`, cause);
		this.statusCode = 400;
	}
}
