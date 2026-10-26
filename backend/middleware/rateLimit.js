/**
 * Lightweight in-memory fixed-window rate limiter.
 * Suitable for local/single-instance deployments. Use a shared store (e.g. Redis)
 * before running multiple backend instances.
 */
function createRateLimiter({
  windowMs = 60_000,
  max = 10,
  keyGenerator = (req) => req.ip || req.socket?.remoteAddress || "unknown",
  now = Date.now,
  code = "AI_RATE_LIMIT_EXCEEDED",
  message = "Too many requests. Please wait before trying again.",
} = {}) {
  const buckets = new Map();

  if (!Number.isFinite(windowMs) || windowMs < 1) {
    throw new TypeError("windowMs must be a positive number");
  }
  if (!Number.isInteger(max) || max < 1) {
    throw new TypeError("max must be a positive integer");
  }

  return function rateLimit(req, res, next) {
    const currentTime = now();
    const key = String(keyGenerator(req));
    let bucket = buckets.get(key);

    if (!bucket || currentTime >= bucket.resetAt) {
      bucket = { count: 0, resetAt: currentTime + windowMs };
      buckets.set(key, bucket);
    }

    bucket.count += 1;
    const remaining = Math.max(0, max - bucket.count);
    const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt - currentTime) / 1000));

    res.setHeader("RateLimit-Limit", String(max));
    res.setHeader("RateLimit-Remaining", String(remaining));
    res.setHeader("RateLimit-Reset", String(Math.ceil(bucket.resetAt / 1000)));

    if (bucket.count > max) {
      res.setHeader("Retry-After", String(retryAfterSeconds));
      return res.status(429).json({
        success: false,
        code,
        message,
        retryAfterSeconds,
      });
    }

    // Periodically remove expired buckets to keep memory bounded.
    if (buckets.size > 1000) {
      for (const [bucketKey, value] of buckets) {
        if (currentTime >= value.resetAt) buckets.delete(bucketKey);
      }
    }

    return next();
  };
}

module.exports = createRateLimiter;
