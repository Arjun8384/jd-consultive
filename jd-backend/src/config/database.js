const mongoose = require('mongoose');
const logger   = require('./logger');

const MONGO_OPTIONS = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS:          45000,
  maxPoolSize:              10,
  minPoolSize:              2,
};

let retries = 0;
const MAX_RETRIES = 5;

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    logger.error('MONGO_URI is not set in environment variables');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, MONGO_OPTIONS);
    retries = 0;
    logger.info('MongoDB connected successfully');
  } catch (err) {
    retries += 1;
    logger.error(`MongoDB connection attempt ${retries} failed: ${err.message}`);

    if (retries >= MAX_RETRIES) {
      logger.error('Max MongoDB connection retries reached. Exiting.');
      process.exit(1);
    }

    const delay = Math.min(1000 * 2 ** retries, 30000); // exponential backoff, max 30s
    logger.info(`Retrying MongoDB connection in ${delay / 1000}s…`);
    setTimeout(connectDB, delay);
  }
}

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected — attempting reconnect…');
  connectDB();
});

mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB error: ${err.message}`);
});

module.exports = connectDB;
