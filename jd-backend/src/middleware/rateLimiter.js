const rateLimit = require('express-rate-limit');

// Global — 100 requests per 15 min per IP
const globalLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             100,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { error: 'Too many requests. Please try again later.' },
});

// Form submissions — 5 per hour per IP
const submissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max:      5,
  message:  { error: 'Too many submissions from this IP. Please try again in an hour.' },
});

// Admin login — 10 per 15 min per IP (locks out brute force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      10,
  message:  { error: 'Too many login attempts. Try again in 15 minutes.' },
});

module.exports = { globalLimiter, submissionLimiter, loginLimiter };
