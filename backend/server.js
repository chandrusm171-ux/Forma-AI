require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const routes = require("./routes");

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const allowedOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  res.json({ success: true, message: "Forma-AI Backend is running" });
});

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((error, _req, res, _next) => {
  if (error.type === "entity.too.large") {
    return res.status(413).json({ success: false, message: "Request body is too large" });
  }

  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ success: false, message: "Request body must be valid JSON" });
  }

  console.error("Unhandled API error:", error.message);
  return res.status(500).json({ success: false, message: "Unexpected server error" });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Do not terminate the API if Atlas is temporarily unavailable. The health
  // route reports database readiness and DB-dependent routes return HTTP 503.
  void connectDB();
});

async function shutdown(signal) {
  console.log(`${signal} received; shutting down Forma-AI backend...`);
  server.close(async () => {
    try {
      await mongoose.disconnect();
    } finally {
      process.exit(0);
    }
  });
}

process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));

module.exports = app;
