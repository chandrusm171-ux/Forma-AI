const test = require("node:test");
const assert = require("node:assert/strict");
const createRateLimiter = require("../middleware/rateLimit");

function createResponse() {
  return {
    headers: {},
    statusCode: 200,
    body: null,
    setHeader(name, value) { this.headers[name] = value; return this; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

test("rate limiter allows requests up to the configured maximum", () => {
  let now = 1000;
  const limit = createRateLimiter({ windowMs: 5000, max: 2, now: () => now });
  const req = { ip: "test-client" };
  let nextCount = 0;

  const first = createResponse();
  limit(req, first, () => { nextCount += 1; });
  const second = createResponse();
  limit(req, second, () => { nextCount += 1; });

  assert.equal(nextCount, 2);
  assert.equal(first.headers["RateLimit-Remaining"], "1");
  assert.equal(second.headers["RateLimit-Remaining"], "0");
});

test("rate limiter blocks requests above the maximum and returns retry guidance", () => {
  const limit = createRateLimiter({
    windowMs: 5000,
    max: 1,
    now: () => 1000,
  });
  const req = { ip: "test-client" };
  limit(req, createResponse(), () => {});
  const response = createResponse();

  limit(req, response, () => assert.fail("next must not run when limit is exceeded"));

  assert.equal(response.statusCode, 429);
  assert.equal(response.body.code, "AI_RATE_LIMIT_EXCEEDED");
  assert.equal(response.headers["Retry-After"], "5");
});

test("rate limiter resets after the window and separates client keys", () => {
  let now = 1000;
  const limit = createRateLimiter({ windowMs: 1000, max: 1, now: () => now });
  const first = createResponse();
  limit({ ip: "a" }, first, () => {});
  const otherClient = createResponse();
  limit({ ip: "b" }, otherClient, () => {});
  now = 2000;
  const reset = createResponse();
  let nextCalled = false;
  limit({ ip: "a" }, reset, () => { nextCalled = true; });

  assert.equal(otherClient.statusCode, 200);
  assert.equal(nextCalled, true);
});
