const express = require("express");

const router = express.Router();

function aiNotConfigured(_req, res) {
  return res.status(501).json({
    success: false,
    code: "AI_SERVICE_NOT_CONFIGURED",
    message: "The AI service is not connected yet. The AI integration owner must configure the extraction provider before this endpoint can be used.",
  });
}

// API contract for the AI integration owner. Replace these handlers when the
// LangChain/LLM service is ready; never return fabricated extraction results.
router.post("/extract", aiNotConfigured);
router.post("/parse-resume", aiNotConfigured);

module.exports = router;
