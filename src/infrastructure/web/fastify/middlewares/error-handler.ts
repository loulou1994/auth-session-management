import type { FastifyRequest, FastifyReply } from "fastify";
import { FastifyError } from "@fastify/error";

import type { ILogger } from "@infrastructure/web/shared/types";
import {
  InputValidationError,
  type ApiErrorResponse,
  APIError,
} from "@shared/types";

export function globalErrorHandlerWrapper(logger: ILogger) {
  return function (error: Error, request: FastifyRequest, reply: FastifyReply) {
    let statusCode = 500;
    const errorResponse: ApiErrorResponse = { success: false };

    if (error instanceof InputValidationError) {
      statusCode = error.statusCode;
      errorResponse.errors = error.errors;
      errorResponse.message = error.message;

    } else if (error instanceof APIError) {
      statusCode = error.statusCode;
      errorResponse.error = error.message;

    } else if (error instanceof FastifyError) {
      statusCode = error.statusCode || statusCode;
      errorResponse.error = error.message;
      
    } else {
      errorResponse.error = error.message;
    }

    logger.error(errorResponse.error || errorResponse.message!, {
      requestId: request.id,
      stack: error.stack,
      cause: error.cause,
    });

    reply.code(statusCode).send(errorResponse);
  };
}
