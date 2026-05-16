import pino from "pino";

export const logger = pino({
	level: "debug",
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
			ignore: "pid,hostname",
			singleLine: true,
		},
	},
});

export const createChildLogger = (component: string) => {
	return logger.child({ component });
};
