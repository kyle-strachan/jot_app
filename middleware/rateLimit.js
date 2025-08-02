import rateLimit from 'express-rate-limit';

export const rateLimitMiddleware = rateLimit({
  windowMs: 60 * 1000, // one-minute window
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: "You have exceeded the maximum requests per minute limit. Try again in a few moments.",
});