const { verifyToken } = require("../utils/authTokens");

function authenticate(req, res, next) {
  const header = req.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return res.status(401).json({ success: false, code: "AUTH_REQUIRED", message: "Sign in to access this resource." });
  }

  let user;
  try {
    user = verifyToken(match[1]);
  } catch (error) {
    if (error.code === "AUTH_NOT_CONFIGURED") {
      return res.status(503).json({ success: false, code: error.code, message: "Authentication is not configured on this server." });
    }
    throw error;
  }
  if (!user) return res.status(401).json({ success: false, code: "INVALID_TOKEN", message: "Your session is invalid or expired. Please sign in again." });
  req.user = user;
  return next();
}

function optionalAuthenticate(req, _res, next) {
  const header = req.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (match) {
    try { req.user = verifyToken(match[1]) || null; } catch { req.user = null; }
  }
  return next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, code: "AUTH_REQUIRED", message: "Sign in to access this resource." });
    if (!roles.includes(req.user.role)) return res.status(403).json({ success: false, code: "FORBIDDEN", message: "You do not have permission to perform this action." });
    return next();
  };
}

module.exports = { authenticate, optionalAuthenticate, requireRole };
