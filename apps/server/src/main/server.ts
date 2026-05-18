import "dotenv/config";
import { db } from "@ponto-up-backend/db";
import { env } from "@ponto-up-backend/env/server";
import cors from "cors";
import { sql } from "drizzle-orm";
import express from "express";
import helmet from "helmet";
import { logger } from "@/infra/logger/logger";
import { requestLogger } from "@/main/middleware/logger";
import { router } from "@/main/routes";
import { setupGracefulShutdown } from "./graceful-shutdown";
import { limiter } from "./middleware/rate-limit";

async function checkDatabaseConnection() {
	try {
		await db.execute(sql`SELECT 1`);
		logger.info("Database connected successfully");
	} catch (error) {
		logger.error("Failed to connect to database");
		process.exit(1);
	}
}

const app = express();

app.use(requestLogger);

app.use(
	cors({
		origin: env.CORS_ORIGIN,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

app.use(express.json());
app.use(helmet({}));
app.use(limiter);

app.use("/api", router);

const PORT = process.env.PORT || 3000;

let server: ReturnType<typeof app.listen>;

(async () => {
	await checkDatabaseConnection();

	server = app.listen(PORT, () => {
		logger.info(`Server is running on http://localhost:${PORT}`);
	});

	const requestCounter = setupGracefulShutdown({
		server,
		db: db.$client,
	});

	app.use(requestCounter);
})();
