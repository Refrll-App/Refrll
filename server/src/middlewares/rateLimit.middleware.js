import rateLimit from 'express-rate-limit';

// 🔐 Rate limit for login & register routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit to 5 requests per IP in 15 minutes
  message: 'Too many attempts. Please try again after 15 minutes.',
  standardHeaders: true, // Adds RateLimit-* headers
  legacyHeaders: false,  // Disable deprecated X-RateLimit-* headers
});

// 🔄 Rate limit for refresh token route
export const refreshLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Max 10 refresh requests per minute
  message: 'Too many token requests. Try again shortly.',
});
