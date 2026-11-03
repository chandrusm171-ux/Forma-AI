
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

const PORT = 5001;

const allowedOrigins = (
  process.env.LOCAL_AI_ALLOWED_ORIGINS ||
  "https://forma-ai-liart.vercel.app,http://localhost:5173,http://127.0.0.1:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable("x-powered-by");

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.use(
  cors({
    origin(origin, callback) {
      if (origin && allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Reject requests without an approved browser origin.
// This is an additional browser-origin check, not user authentication.
app.use((req, res, next) => {
  const origin = req.get("Origin");

  if (!origin || !allowedOrigins.includes(origin)) {
    return res.status(403).json({
      success: false,
      message: "This origin is not allowed to access local AI.",
    });
  }

  // Support browsers that request permission for localhost access.
  res.setHeader("Access-Control-Allow-Private-Network", "true");

  next();
});

app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Forma-AI Local AI Service is running",
    provider: "ollama",
    model: process.env.OLLAMA_MODEL || "llama3.2",
  });
});

app.use("/api/ai", aiRoutes);

app.use((error, _req, res, _next) => {
  console.error("Local AI server error:", error.message);

  res.status(500).json({
    success: false,
    message: "Local AI service error.",
  });
});

// Bind only to loopback; do not expose this service to your LAN.
app.listen(PORT, "127.0.0.1", () => {
  console.log(`Forma-AI Local AI listening at http://127.0.0.1:${PORT}`);
  console.log(`Allowed browser origins: ${allowedOrigins.join(", ")}`);
  console.log(`AI provider: ${process.env.AI_PROVIDER || "ollama"}`);
});
