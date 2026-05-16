import pinoHttp from "pino-http";
import { logger } from "@/infra/logger/logger";

export const requestLogger = pinoHttp({
	logger,
	autoLogging: {
		ignore: (req) => req.url === "/health",
	},
	customSuccessMessage: (req, res) => {
		const query = JSON.stringify(
			(req as { query?: Record<string, unknown> }).query || {},
		);
		const body = JSON.stringify((req as { body?: unknown }).body || {});
		return `${req.method} - ${req.url} - Received request - query: ${query} - body: ${body} - completed with status ${res.statusCode}`;
	},
	customErrorMessage: (req, res, _err) => {
		const query = JSON.stringify(
			(req as { query?: Record<string, unknown> }).query || {},
		);
		const body = JSON.stringify((req as { body?: unknown }).body || {});
		return `${req.method} - ${req.url} - Received request - query: ${query} - body: ${body} - failed with status ${res.statusCode}`;
	},
});
