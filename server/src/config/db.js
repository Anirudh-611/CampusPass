import mongoose from 'mongoose';

/**
 * Initializes and manages the MongoDB connection lifecycle.
 */
export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campuspass';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging indefinitely
    });

    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    console.log(`[MongoDB] Active Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${mongoURI}`);
    console.warn(`[MongoDB Tip] Ensure your local MongoDB service is running, or set MONGO_URI in server/.env to your MongoDB Atlas connection string.`);
  }

  // Lifecycle Event Listeners
  mongoose.connection.on('error', (err) => {
    console.error(`[MongoDB Runtime Error]: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB] Connection lost. Reconnecting...');
  });

  // Graceful shutdown on process termination
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('[MongoDB] Connection closed through app termination (SIGINT).');
    process.exit(0);
  });
};

