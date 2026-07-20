const mongoose = require('mongoose');

let isConnected = false;

mongoose.connection.on('connected', () => {
  isConnected = true;
  console.log('[MongoDB] ✅ Connection established');
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('[MongoDB] ⚠️  Disconnected from MongoDB');
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  console.log('[MongoDB] ✅ Reconnected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  isConnected = false;
  console.error('[MongoDB] ❌ Connection error:', err.message);
});

const connectDB = async (retries = 3) => {
  const connString =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/dailyforge';

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[MongoDB] Connecting... (attempt ${attempt}/${retries})`);
      await mongoose.connect(connString, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });
      isConnected = true;
      console.log(
        `[MongoDB] ✅ Connected to: ${mongoose.connection.host}/${mongoose.connection.name}`
      );
      return true;
    } catch (error) {
      console.error(
        `[MongoDB] ❌ Attempt ${attempt} failed: ${error.message}`
      );
      if (attempt < retries) {
        console.log(`[MongoDB] Retrying in 3 seconds...`);
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
  }

  isConnected = false;
  console.warn(
    '[MongoDB] ⚠️  All connection attempts failed. Running in memory-fallback mode.'
  );
  return false;
};

const getIsConnected = () =>
  isConnected && mongoose.connection.readyState === 1;

module.exports = { connectDB, getIsConnected };
