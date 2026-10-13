const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("MongoDB connection skipped: MONGODB_URI is not configured.");
    return false;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB connected successfully");
    return true;
  } catch (error) {
    // Keep the HTTP server alive so /api/health can report the DB failure.
    // Never log the connection string because it may contain credentials.
    console.error("MongoDB connection failed:", error.message);
    return false;
  }
}

module.exports = connectDB;
