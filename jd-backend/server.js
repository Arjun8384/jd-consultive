require('dotenv').config();

const path = require('path');
const resumeRoutes   = require('./src/routes/resume')
const express        = require('express');
const helmet         = require('helmet');
const cors           = require('cors');
const compression    = require('compression');
const mongoSanitize  = require('express-mongo-sanitize');
const morgan         = require('morgan');

const connectDB          = require('./src/config/database');
const logger             = require('./src/config/logger');
const { globalLimiter }  = require('./src/middleware/rateLimiter');
const enquiryRoutes      = require('./src/routes/enquiry');
const adminRoutes        = require('./src/routes/admin');

const app  = express();
const PORT = process.env.PORT || 4000;
const ENV  = process.env.NODE_ENV || 'development';

connectDB();

// Security headers
app.use(helmet());

// CORS
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',').map(o => o.trim());

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    logger.warn(`CORS blocked: ${origin}`);
    return cb(new Error(`Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// Sanitize MongoDB operators (NoSQL injection protection)
app.use(mongoSanitize());

// Gzip compression
app.use(compression());

// HTTP logging
app.use(morgan(ENV === 'production' ? 'combined' : 'dev', {
  stream: { write: (msg) => logger.http(msg.trim()) },
}));

// Global rate limit
app.use(globalLimiter);

// Trust reverse proxy (needed for Hostinger/cPanel/Nginx)
app.set('trust proxy', 1);

// Routes
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: 'ok',
    env: ENV,
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/enquiry', enquiryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/resume', resumeRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});


app.use(
  '/api/resume',
  resumeRoutes
);

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {

  console.log('ERROR =>', err);

  logger.error(
    `Unhandled error: ${
      err?.message || JSON.stringify(err)
    }`
  );

  res.status(
    err?.status || 500
  ).json({
    error:
      err?.message ||
      'Internal server error'
  });

});

// Start
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${ENV} mode on port ${PORT}`);
  logger.info(`Health: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
const shutdown = (signal) => {
  logger.info(`${signal} — shutting down gracefully`);
  server.close(async () => {
    const mongoose = require('mongoose');
    await mongoose.connection.close();
    logger.info('Shutdown complete');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => logger.error(`Unhandled rejection: ${reason}`));
