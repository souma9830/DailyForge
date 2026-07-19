const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const connString = process.env.MONGODB_URI || 'mongodb://localhost:27017/dailyforge';
  try {
    const conn = await mongoose.connect(connString, {
      serverSelectionTimeoutMS: 3000, // Quick timeout if local mongo is offline
    });
    isConnected = true;
    console.log(`[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB Warning]: Could not connect to MongoDB at "${connString}". ${error.message}`);
    console.warn('[MongoDB Notice]: Backend will operate in hybrid mode with in-memory fallback state so app works out-of-the-box.');
    return false;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
