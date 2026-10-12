
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const routes = require("./routes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API routes
app.use("/api", routes);

/*
 * API Routes
 */


/*
 * Root route
 */
app.get("/", (req, res) => {
  res.json({
    message: "Forma-AI Backend is running",
  });
});

connectDB();

/*
 * Start server
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
