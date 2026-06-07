import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		"main/server": "./src/main/server.ts",
	},
	format: "esm",
	outDir: "./dist",
	clean: true,
	platform: "node",
	noExternal: [/@ponto-up-backend\/.*/],
	external: [
		"pg",
		"pino",
		"pino-http",
		"pino-pretty",
		"drizzle-orm",
		"better-auth",
		"express",
		"cors",
		"helmet",
		"express-rate-limit",
		"dotenv",
		"zod",
	],
	outExtension: ({ format }) => ({ js: ".mjs" }),
});
