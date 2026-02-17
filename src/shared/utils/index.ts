import fsPromise from "node:fs/promises";
import path from "node:path";
import sanitize from "sanitize-filename";

import { ServiceError } from "@shared/types";

const envRootDirectory = path.join(process.cwd(), process.env.ROOT || "src");

export async function createFile(directory: string, filename: string) {
	const sanitizedFileName = sanitize(filename);
	const absFilePath = path.resolve(envRootDirectory, directory, sanitizedFileName);

	try {
		await fsPromise.mkdir(path.dirname(absFilePath), { recursive: true });

		(await fsPromise.open(absFilePath, "a")).close();

		return absFilePath;
	} catch (_) {
		throw new Error(`Couldn't create file ${filename}`);
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
