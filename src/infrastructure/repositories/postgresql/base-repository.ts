import {
	ConstraintViolationError,
	DatabaseConnectionError,
	DatabaseTimeoutError,
	DuplicateEntityError,
	RepositoryError,
} from "@infrastructure/repositories/errors";
import type { Context } from "@infrastructure/repositories/shared/types";
import { extractField } from "@infrastructure/repositories/shared/utils";

export abstract class BaseRepository {
	protected async executeDbOperation<T>(
		operation: () => Promise<T>,
		context?: Context,
	) {
		try {
			return await operation();
		} catch (err) {
			this.handleDatabaseError(err, context);
		}
	}

	protected handleDatabaseError(error: unknown, context?: Context): never {
		const pgError = error as {
			code: string;
			detail?: string;
			constraint_name?: string;
		};
		
		switch (pgError.code) {
			case "23505":
				throw new DuplicateEntityError(
					extractField(pgError.detail) || "field",
					pgError,
				);

			case "23503":
				throw new ConstraintViolationError(
					pgError.constraint_name || "foreign_key",
					pgError,
				);

			case "08000":
			case "08006":
				throw new DatabaseConnectionError(pgError);

			case "57014":
				throw new DatabaseTimeoutError(context?.operation || "Unknown");

			default:
				throw new RepositoryError(
					"Error happened while querying database",
					pgError,
				);
		}
	}
}
