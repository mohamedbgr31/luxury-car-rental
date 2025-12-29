import mongoose from 'mongoose';

// Get MongoDB URI from environment variables
let MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGO_URL;

// Clean up the URI - remove quotes and fix double slashes
if (MONGODB_URI) {
  MONGODB_URI = MONGODB_URI.replace(/^["']|["']$/g, '');
  MONGODB_URI = MONGODB_URI.replace(/([^:]\/)\/luxurycar/, '$1luxurycar');
  if (!MONGODB_URI.includes('/luxurycar')) {
    MONGODB_URI = MONGODB_URI.replace(/\?.*$/, '/luxurycar?retryWrites=true&w=majority');
  }
} else {
  MONGODB_URI = 'mongodb://127.0.0.1:27017/luxurycar';
}

// Global connection state
let isConnected = false;
let connectionPromise = null;
let connectionStartTime = null;
let connectionRetries = 0;
const MAX_RETRIES = 3;

export async function connectDB() {
  // If already connected and healthy, return immediately
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  // If connection is in progress, wait for it
  if (connectionPromise) {
    return connectionPromise;
  }

  // Start new connection
  connectionStartTime = Date.now();
  connectionRetries = 0;
  connectionPromise = connect();
  
  try {
    await connectionPromise;
  } catch (error) {
    connectionPromise = null;
    throw error;
  }
}

async function connect() {
  try {
    // Reuse existing connection without disconnecting
    if (mongoose.connection.readyState === 1) {
      console.log('Using existing MongoDB connection');
      isConnected = true;
      connectionPromise = null;
      return;
    }

    // If connection is in progress, wait for it
    if (mongoose.connection.readyState === 2) {
      console.log('MongoDB connection in progress, waiting...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (mongoose.connection.readyState === 1) {
        isConnected = true;
        connectionPromise = null;
        return;
      }
    }

    // Connect with improved options for SSL/TLS
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      ssl: true,
      tls: true
    });

    isConnected = true;
    connectionPromise = null;
    console.log('MongoDB connected successfully');
  } catch (error) {
    // Handle connection errors with retries
    connectionRetries++;
    
    // Check if error is related to SSL/TLS
    const isSSLError = /SSL|ECONNRESET|socket|handshake|bad record mac/i.test(error?.message || '');
    
    if (connectionRetries < MAX_RETRIES && isSSLError) {
      console.log(`MongoDB connection failed (attempt ${connectionRetries}/${MAX_RETRIES}): ${error.message}`);
      console.log('Retrying connection...');
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      return connect();
    }
    
    isConnected = false;
    connectionPromise = null;
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  }
});

// Export the cleaned URI for debugging
export { MONGODB_URI };