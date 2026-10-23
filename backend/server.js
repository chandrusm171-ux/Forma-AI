require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");
const connectDB = require("./config/db");

const http = require("node:http");
const { createSocketServer } = require("./realtime/socketServer");

const PORT = Number(process.env.PORT) || 5000;
const DB_RETRY_INTERVAL_MS = Math.max(
  5000,
  Number(process.env.DB_RETRY_INTERVAL_MS) || 15000
);

let retryTimer;
let isShuttingDown = false;
let isConnecting = false;

async function connectWithRetry() {
  if (isShuttingDown || isConnecting || mongoose.connection.readyState === 1) {
    return;
  }

  // Missing configuration is a setup issue, not a transient connection failure.
  if (!process.env.MONGODB_URI?.trim()) {
    console.error(
      "MongoDB is not configured. Set MONGODB_URI in backend/.env; API will remain available in degraded mode."
    );
    return;
  }

  isConnecting = true;
  let connected = false;
  try {
    connected = await connectDB();
  } catch (error) {
    console.error("Unexpected MongoDB connection error:", error.message);
  } finally {
    isConnecting = false;
  }

  if (!connected && !isShuttingDown) {
    console.warn(
      `MongoDB is unavailable. Retrying in ${Math.round(DB_RETRY_INTERVAL_MS / 1000)} seconds.`
    );
    retryTimer = setTimeout(() => void connectWithRetry(), DB_RETRY_INTERVAL_MS);
    retryTimer.unref();
  }
}

const server = http.createServer(app);
const io = createSocketServer(server);

server.listen(PORT, () => {
  console.log(`Forma-AI API listening on port ${PORT}`);
  void connectWithRetry();
});
server.on("error", (error) => {
  console.error("HTTP server failed to start:", error.message);
  process.exitCode = 1;
});

async function shutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  clearTimeout(retryTimer);
  console.log(`${signal} received; shutting down Forma-AI backend...`);

   io.close(async () => {
    try {
      await mongoose.disconnect();
      process.exitCode = 0;
    } catch (error) {
      console.error("Error while closing MongoDB connection:", error.message);
      process.exitCode = 1;
    }
  });
}

process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));
