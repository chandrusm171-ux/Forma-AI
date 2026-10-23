const express = require("express");
const createRateLimiter = require("../middleware/rateLimit");
const {
  AIServiceError,
  extractFormData,
} = require("../services/aiExtractionService");

const router = express.Router();

const aiRateLimit = createRateLimiter({
  windowMs: Math.max(1000, Number(process.env.AI_RATE_LIMIT_WINDOW_MS) || 60_000),
  max: Math.max(1, Number(process.env.AI_RATE_LIMIT_MAX) || 10),
});

router.post("/extract", aiRateLimit, async (req, res) => {
  // AI output may contain user-provided personal information; avoid browser/proxy caching.
  res.set("Cache-Control", "no-store");
  try {
    const { text, schemaId = "insurance-claim" } = req.body || {};
    const data = await extractFormData({ text, schemaId });

    return res.status(200).json({
      success: true,
      message: "Suggested field values extracted. Review every value before submitting the form.",
      data,
    });
  } catch (error) {
    if (error instanceof AIServiceError) {
      return res.status(error.statusCode).json({
        success: false,
        code: error.code,
        message: error.message,
      });
    }

    console.error("Unexpected AI extraction error:", error.message);
    return res.status(500).json({
      success: false,
      code: "AI_EXTRACTION_FAILED",
      message: "AI extraction failed unexpectedly. Please try again.",
    });
  }
});

// Resume parsing is a separate feature and remains explicitly unavailable until
// file extraction, file validation, and document parsing are implemented.
router.post("/parse-resume", (_req, res) => {
  return res.status(501).json({
    success: false,
    code: "RESUME_PARSER_NOT_CONFIGURED",
    message: "Resume parsing is not implemented yet. Incident description extraction is available when an AI provider is configured.",
  });
});

module.exports = router;
