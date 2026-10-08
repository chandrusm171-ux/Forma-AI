const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const healthRoutes = require("./routes/healthRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/*
 * Middleware
 *
 * These must be registered before the API routes so that
 * CORS and JSON parsing are applied to every backend endpoint.
 */
app.use(cors());
app.use(express.json());

/*
 * API Routes
 */
app.use("/api/health", healthRoutes);

/*
 * Root route
 */
app.get("/", (req, res) => {
  res.json({
    message: "Forma-AI Backend is running",
  });
});

/*
 * Database connection
 */
connectDB();

/*
 * Start server
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});