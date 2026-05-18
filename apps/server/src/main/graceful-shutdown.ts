import type { Server } from "http";
import type { Pool } from "pg";
import { logger } from "@/infra/logger/logger";

export interface GracefulShutdownOptions {
	server: Server;
	db: Pool;
	timeout?: number;
}

export function setupGracefulShutdown({
	server,
	db,
	timeout = 30000,
}: GracefulShutdownOptions) {
	let isShuttingDown = false;
	let activeRequests = 0;

	async function gracefulShutdown(signal: string) {
		if (isShuttingDown) return;
		isShuttingDown = true;

		logger.info(`Received ${signal}, shutting down gracefully...`);

		server.close(() => {
			logger.info("HTTP server closed (no more connections)");
		});

		const startTime = Date.now();
		while (activeRequests > 0 && Date.now() - startTime < timeout) {
			await new Promise((resolve) => setTimeout(resolve, 100));
		}

		if (activeRequests > 0) {
			logger.warn(`Forced shutdown: ${activeRequests} requests still pending`);
		}

		try {
			await db.end();
			logger.info("Database connection closed");
		} catch (error) {
			logger.error({ err: error }, "Error closing database connection");
		}

		logger.info("Graceful shutdown complete");
		process.exit(0);
	}

	process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
	process.on("SIGINT", () => gracefulShutdown("SIGINT"));

	return (
		_req: unknown,
		res: {
			set: (key: string, value: string) => void;
			on: (event: string, callback: () => void) => void;
		},
		next: () => void,
	) => {
		if (isShuttingDown) {
			res.set("Connection", "close");
		}
		activeRequests++;
		res.on("finish", () => activeRequests--);
		next();
	};
}
