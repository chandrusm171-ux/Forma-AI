const crypto = require("node:crypto");

const TOKEN_TTL_SECONDS = Math.max(300, Number(process.env.AUTH_TOKEN_TTL_SECONDS) || 8 * 60 * 60);

function getSecret() {
  const secret = process.env.AUTH_TOKEN_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32 || /replace-with|change-me|example-secret/i.test(secret)) {
    const error = new Error("AUTH_TOKEN_SECRET must be configured with at least 32 characters.");
    error.code = "AUTH_NOT_CONFIGURED";
    throw error;
  }
  return secret;
}

function base64url(value) {
  return Buffer.from(value).toString("base64url");
}

function signToken(user) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    sub: String(user._id || user.id),
    email: user.email,
    role: user.role || "user",
    iat: now,
    exp: now + TOKEN_TTL_SECONDS,
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
  const signature = crypto.createHmac("sha256", getSecret()).update(unsigned).digest("base64url");
  return `${unsigned}.${signature}`;
}

function verifyToken(token) {
  if (typeof token !== "string" || token.length > 4096) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const secret = getSecret();

  try {
    const [encodedHeader, encodedPayload, signature] = parts;
    const header = JSON.parse(Buffer.from(encodedHeader, "base64url").toString("utf8"));
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
    if (header.alg !== "HS256" || header.typ !== "JWT") return null;

    const unsigned = `${encodedHeader}.${encodedPayload}`;
    const expected = crypto.createHmac("sha256", secret).update(unsigned).digest();
    const actual = Buffer.from(signature, "base64url");
    if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) return null;
    const now = Math.floor(Date.now() / 1000);
    if (!payload.sub || !Number.isFinite(payload.exp) || payload.exp <= now) return null;
    if (typeof payload.email !== "string" || typeof payload.role !== "string") return null;
    return { id: payload.sub, email: payload.email, role: payload.role, expiresAt: payload.exp };
  } catch {
    return null;
  }
}

module.exports = { signToken, verifyToken, TOKEN_TTL_SECONDS, assertTokenConfigured: getSecret };
