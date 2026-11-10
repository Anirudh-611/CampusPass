import mongoose from 'mongoose';
import dns from 'node:dns';

// Configure reliable DNS servers to prevent Windows querySrv ECONNREFUSED on Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore in environments where setting DNS servers is restricted
}

/**
 * Initializes and manages the MongoDB connection lifecycle.
 */
export const connectDB = async () => {
  let mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campuspass';

  // Automatically attach database name and write parameters if omitted
  if (mongoURI.startsWith('mongodb+srv://') && mongoURI.endsWith('/')) {
    mongoURI = `${mongoURI}campuspass?retryWrites=true&w=majority`;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    console.log(`[MongoDB] Active Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${mongoURI}`);
    console.warn(`[MongoDB Tip] Ensure your MongoDB Atlas user credentials and Network Access (IP whitelist 0.0.0.0/0) are active.`);
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

