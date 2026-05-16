import "dotenv/config";
import { env } from "@ponto-up-backend/env/server";
import cors from "cors";
import express from "express";
import { logger } from "@/infra/logger/logger";
import { requestLogger } from "@/main/middleware/logger";
import { router } from "@/main/routes";

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

app.listen(PORT, () => {
	logger.info(`Server is running on http://localhost:${PORT}`);
});
