const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");

process.env.AUTH_TOKEN_SECRET = "test-only-secret-that-is-at-least-32-characters-long";
const { signToken, verifyToken } = require("../utils/authTokens");
const { hashPassword, verifyPassword } = require("../utils/passwords");

const sampleUser = { _id: "507f1f77bcf86cd799439011", email: "test@example.com", role: "user" };

test("password hashes are salted and can be verified", async () => {
  const first = await hashPassword("a-long-test-password");
  const second = await hashPassword("a-long-test-password");
  assert.notEqual(first, second);
  assert.equal(await verifyPassword("a-long-test-password", first), true);
  assert.equal(await verifyPassword("wrong-password", first), false);
});

test("token verifies and returns only expected identity claims", () => {
  const token = signToken(sampleUser);
  const claims = verifyToken(token);
  assert.equal(claims.id, sampleUser._id);
  assert.equal(claims.email, sampleUser.email);
  assert.equal(claims.role, "user");
  assert.equal(typeof claims.expiresAt, "number");
});

test("tampered tokens are rejected", () => {
  const token = signToken(sampleUser);
  const tampered = `${token.slice(0, -1)}${token.endsWith("a") ? "b" : "a"}`;
  assert.equal(verifyToken(tampered), null);
});

test("expired tokens are rejected", () => {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({ sub: sampleUser._id, email: sampleUser.email, role: "user", iat: 1, exp: 2 })).toString("base64url");
  const unsigned = `${header}.${payload}`;
  const signature = crypto.createHmac("sha256", process.env.AUTH_TOKEN_SECRET).update(unsigned).digest("base64url");
  assert.equal(verifyToken(`${unsigned}.${signature}`), null);
});
