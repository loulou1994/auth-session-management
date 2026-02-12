import pino from "pino";

import type { ILogger, LogMetadata } from "@shared/types";
import { createFile } from "@shared/utils";

class PinoLogger implements ILogger {
	private logger: pino.Logger<never, boolean>;

	private constructor(pinoIns: pino.Logger<never, boolean>) {
		this.logger = pinoIns;
	}

	static async createLog(): Promise<PinoLogger> {
		try {
			const logFilePath = await createFile("logs/log.log");

			return new PinoLogger(
				pino(
					{
						name: "auth-session",
						level: "info",
						messageKey: "message",
						base: null,
						timestamp: () =>
							`,"timestamp":"${new Date(Date.now()).toISOString()}"`,

						formatters: {
							level: (label, _) => {
								return { level: label };
							},
						},
					},
					pino.destination({ dest: logFilePath, sync: true }),
				),
			);
		} catch (err) {
			console.log(
				`Error happened while writing the log file.\n${(err as Error).message}`,
			);
			process.exit(1);
		}
	}

	info(message: string, meta?: LogMetadata): void {
		this.logger.info(meta, message);
	}

	error(message: string, meta?: LogMetadata): void {
		this.logger.error(meta, message);
	}
}

export const pinoLogger = PinoLogger.createLog();