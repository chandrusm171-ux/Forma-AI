const mongoose = require("mongoose");

const healthCheck = (_req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;

  return res.status(200).json({
    success: true,
    status: databaseReady ? "ready" : "degraded",
    service: "Forma-AI API",
    database: databaseReady ? "connected" : "disconnected",
    message: databaseReady
      ? "API and database are ready"
      : "API is running, but the database is not connected",
    timestamp: new Date().toISOString(),
  });
};

module.exports = healthCheck;
