const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    console.error("MongoDB connection skipped: MONGODB_URI is not configured.");
    return false;
  }

  if (mongoose.connection.readyState === 1) {
    return true;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      // Keep the driver's default secure TLS verification for Atlas SRV URIs.
    });
    console.log("MongoDB connected successfully");
    return true;
  } catch (error) {
    // Never log the URI; it contains credentials. Preserve the useful diagnostic code.
    console.error("MongoDB connection failed:", {
      name: error.name,
      code: error.code,
      message: error.message,
    });
    return false;
  }
}

module.exports = connectDB;
