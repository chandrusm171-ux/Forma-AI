const mongoose = require("mongoose");

function requireDatabase(_req, res, next) {
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  return res.status(503).json({
    success: false,
    code: "DATABASE_UNAVAILABLE",
    message: "The database is not connected. Please try again later.",
  });
}

module.exports = requireDatabase;
