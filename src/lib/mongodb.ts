import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
  var mongoose: any;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Check environment variable inside the function
  const MONGODB_URI = process.env.DB_URI;
  
  console.log("All environment variables:", Object.keys(process.env).filter(key => key.includes('DB') || key.includes('API')));
  console.log("MONGODB_URI value:", MONGODB_URI);
  
  if (!MONGODB_URI) {
    console.log("MONGODB_URI is not defined:", MONGODB_URI);
    throw new Error('Please define the DB_URI environment variable inside .env.local');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
