const express = require("express");
const User = require("../models/User");
const requireDatabase = require("../middleware/requireDatabase");
const createRateLimiter = require("../middleware/rateLimit");
const { hashPassword, verifyPassword } = require("../utils/passwords");
const { signToken, assertTokenConfigured } = require("../utils/authTokens");
const { authenticate } = require("../middleware/authenticate");

const router = express.Router();
const authLimiter = createRateLimiter({
  windowMs: Math.max(1000, Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 60_000),
  max: Math.max(1, Number(process.env.AUTH_RATE_LIMIT_MAX) || 8),
  code: "AUTH_RATE_LIMIT_EXCEEDED",
  message: "Too many sign-in attempts. Please wait before trying again.",
});
function publicUser(user) {
  return { id: String(user._id), name: user.name, email: user.email, role: user.role, createdAt: user.createdAt };
}

function validEmail(value) {
  return typeof value === "string" && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

router.post("/register", authLimiter, requireDatabase, async (req, res) => {
  try { assertTokenConfigured(); } catch (error) {
    return res.status(503).json({ success: false, code: error.code || "AUTH_NOT_CONFIGURED", message: error.message });
  }
  const { name, email, password } = req.body || {};
  if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 80) {
    return res.status(400).json({ success: false, code: "INVALID_NAME", message: "Name must contain between 2 and 80 characters." });
  }
  if (!validEmail(email)) return res.status(400).json({ success: false, code: "INVALID_EMAIL", message: "Enter a valid email address." });
  if (typeof password !== "string" || password.length < 6 || password.length > 128) {
    return res.status(400).json({ success: false, code: "WEAK_PASSWORD", message: "Password must be between 6 and 128 characters." });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail }).select("_id");
    if (existing) return res.status(409).json({ success: false, code: "EMAIL_IN_USE", message: "An account with this email already exists." });

    // Public registration always creates a regular user. Never accept a role from the request body.
    const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash: await hashPassword(password), role: "user" });
    const token = signToken(user);
    return res.status(201).json({ success: true, message: "Account created successfully.", data: { user: publicUser(user), token, expiresIn: Number(process.env.AUTH_TOKEN_TTL_SECONDS) || 28800 } });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ success: false, code: "EMAIL_IN_USE", message: "An account with this email already exists." });
    if (error.code === "AUTH_NOT_CONFIGURED") return res.status(503).json({ success: false, code: error.code, message: error.message });
    console.error("Account registration failed:", error.message);
    return res.status(500).json({ success: false, code: "REGISTRATION_FAILED", message: "Could not create your account. Please try again." });
  }
});

router.post("/login", authLimiter, requireDatabase, async (req, res) => {
  try { assertTokenConfigured(); } catch (error) {
    return res.status(503).json({ success: false, code: error.code || "AUTH_NOT_CONFIGURED", message: error.message });
  }
  const { email, password } = req.body || {};
  if (!validEmail(email) || typeof password !== "string" || !password || password.length > 128) {
    return res.status(400).json({ success: false, code: "INVALID_CREDENTIALS_FORMAT", message: "Enter a valid email address and password." });
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+passwordHash");
    const valid = user ? await verifyPassword(password, user.passwordHash) : false;
    if (!valid) return res.status(401).json({ success: false, code: "INVALID_CREDENTIALS", message: "Email or password is incorrect." });
    const token = signToken(user);
    return res.status(200).json({ success: true, message: "Signed in successfully.", data: { user: publicUser(user), token, expiresIn: Number(process.env.AUTH_TOKEN_TTL_SECONDS) || 28800 } });
  } catch (error) {
    if (error.code === "AUTH_NOT_CONFIGURED") return res.status(503).json({ success: false, code: error.code, message: error.message });
    console.error("Sign-in failed:", error.message);
    return res.status(500).json({ success: false, code: "LOGIN_FAILED", message: "Could not sign in. Please try again." });
  }
});

router.get("/me", authenticate, requireDatabase, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email role createdAt");
    if (!user) return res.status(401).json({ success: false, code: "ACCOUNT_NOT_FOUND", message: "This account no longer exists. Please sign in again." });
    return res.json({ success: true, data: publicUser(user) });
  } catch (error) {
    console.error("Current user lookup failed:", error.message);
    return res.status(500).json({ success: false, code: "USER_LOOKUP_FAILED", message: "Could not load your account." });
  }
});

module.exports = router;
