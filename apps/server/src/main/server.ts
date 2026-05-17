import "dotenv/config";
import { db } from "@ponto-up-backend/db";
import { env } from "@ponto-up-backend/env/server";
import cors from "cors";
import { sql } from "drizzle-orm";
import express from "express";
import { logger } from "@/infra/logger/logger";
import { requestLogger } from "@/main/middleware/logger";
import { router } from "@/main/routes";

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

app.use("/api", router);

const PORT = process.env.PORT || 3000;

(async () => {
	await checkDatabaseConnection();

	app.listen(PORT, () => {
		logger.info(`Server is running on http://localhost:${PORT}`);
	});
})();
