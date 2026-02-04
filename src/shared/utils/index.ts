import fsPromise from "node:fs/promises";
import path from "node:path";

import { type ApiSuccessResponse, ServiceError } from "@shared/types";

const envRootDirectory = path.join(
	process.cwd(),
	process.env.NODE_ENV !== "production" ? "src" : "dist",
);

export async function createFile(filePath: string) {
	const absFilePath = path.resolve(envRootDirectory, filePath);

	try {
		if (!absFilePath.startsWith(envRootDirectory)) {
			throw `The file path seems to be outside of root directory`;
		}

		await fsPromise.mkdir(path.dirname(absFilePath), { recursive: true });
		(await fsPromise.open(absFilePath, "a")).close();

		return absFilePath;
	} catch (err) {
		throw new Error(
			`Couldn't create file ${filePath}. Details on the error:\n${err.message}`,
		);
	}
}

// export const createSuccessResponse = <T>(
//   message: string,
//   data?: T
// ): ApiSuccessResponse<T> => {
//   return {
//     success: true,
//     message,
//     data: data,
//   };
// };

export const createServiceError = (
	message: string,
	cause: unknown,
	statusCode?: number,
): ServiceError => {
	return new ServiceError(message, cause, statusCode || 500);
};
