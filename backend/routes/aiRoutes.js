const express = require("express");
const createRateLimiter = require("../middleware/rateLimit");
const {
  AIServiceError,
  extractFormData,
} = require("../services/aiExtractionService");
const { readResumeUpload, UploadError } = require("../utils/readResumeUpload");
const { extractDocumentText, DocumentParseError } = require("../utils/extractDocumentText");

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

const resumeRateLimit = createRateLimiter({
  windowMs: Math.max(1000, Number(process.env.RESUME_RATE_LIMIT_WINDOW_MS) || 60_000),
  max: Math.max(1, Number(process.env.RESUME_RATE_LIMIT_MAX) || 3),
});

// Parse a PDF or DOCX in memory. The uploaded document is never saved to disk
// or persisted in MongoDB; only extracted, schema-validated suggestions return.
router.post("/parse-resume", resumeRateLimit, async (req, res) => {
  res.set("Cache-Control", "no-store");
  try {
    const upload = await readResumeUpload(req);
    const text = extractDocumentText(upload.buffer, upload.extension);
    // Keep model input bounded even when a document contains unusually long text.
    const result = await extractFormData({
      text: text.slice(0, 10_000),
      schemaId: "resume-profile",
    });

    const skills = typeof result.skills === "string"
      ? [...new Set(result.skills.split(/[,;\n•|]/).map((skill) => skill.trim()).filter(Boolean))].slice(0, 40)
      : [];
    const data = {
      name: result.name || "",
      email: result.email || "",
      role: result.role || "",
      experience: result.experience || "",
      education: result.education || "",
      skills,
      summary: result.summary || "",
    };

    if (!data.name && !data.email && !data.role && !data.experience && !data.education && !data.skills.length && !data.summary) {
      return res.status(422).json({
        success: false,
        code: "NO_RESUME_FIELDS_EXTRACTED",
        message: "Readable text was found, but no resume fields could be extracted. Try a clearer PDF or DOCX file.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume details extracted. Review every field before using them.",
      data,
      meta: { fileName: upload.originalName, source: "document-text" },
    });
  } catch (error) {
    if (error instanceof UploadError || error instanceof DocumentParseError || error instanceof AIServiceError) {
      return res.status(error.statusCode || 400).json({
        success: false,
        code: error.code || "RESUME_PARSE_FAILED",
        message: error.message,
      });
    }

    console.error("Resume parsing failed:", error.message);
    return res.status(500).json({
      success: false,
      code: "RESUME_PARSE_FAILED",
      message: "Resume parsing failed unexpectedly. Please try a different PDF or DOCX file.",
    });
  }
});

module.exports = router;
