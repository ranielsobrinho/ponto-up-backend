import rateLimit from "express-rate-limit";

// INFO: limit 100 requests per 2 minutes
export const limiter = rateLimit({
	windowMs: 2 * 60 * 1000,
	max: 100,
});
