import dns from 'dns';
import mongoose from 'mongoose';

// Fix for Windows / ISP DNS rejecting MongoDB Atlas SRV queries (querySrv ECONNREFUSED)
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
  console.warn('[DNS Warning] Could not set custom DNS servers:', err.message);
}

export const connectDB = async () => {
  try {
    const mongoUri = (process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/task_management').trim();
    
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true
    });
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Error] Failed to connect: ${error.message}`);
    console.warn(`[MongoDB Notice] If using MongoDB Atlas, make sure:`);
    console.warn(`1. Your IP is allowed in Atlas (Network Access -> 0.0.0.0/0)`);
    console.warn(`2. Your username & password in MONGODB_URI are correct`);
  }
};
