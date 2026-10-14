const mongoose = require("mongoose");

function readinessCheck(_req, res) {
  const databaseReady = mongoose.connection.readyState === 1;

  return res.status(databaseReady ? 200 : 503).json({
    success: databaseReady,
    status: databaseReady ? "ready" : "not_ready",
    service: "Forma-AI API",
    database: databaseReady ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
}

module.exports = readinessCheck;
