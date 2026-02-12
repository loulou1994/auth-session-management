import "module-alias/register";

import { pinoLogger } from "@shared/utils/logger";
import { bootstrap } from "./app";

(async () => {
	const logger = await pinoLogger;

	try {
		const [server] = await bootstrap();
		const PORT = parseInt(process.env.PORT || "3000", 10);

		await server.listen({ port: PORT });
		logger.info(
			`server running on http://${server.addresses()[0].address}:${PORT}`,
		);
		console.log("server running");
	} catch (error) {
		logger.error("Error happend while starting up server", {
			stack: (error as Error).stack,
			cause: error,
		});
		console.log(`Error encountered at server startup:\n${error}`);
		process.exit(1);
	}
})();
