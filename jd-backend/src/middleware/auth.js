const jwt    = require('jsonwebtoken');
const logger = require('../config/logger');

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized — no token provided' });
  }

  try {
    req.admin = jwt.verify(auth.slice(7), process.env.JWT_SECRET);
    next();
  } catch (err) {
    logger.warn(`Invalid token attempt from IP: ${req.ip} — ${err.message}`);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = requireAuth;
