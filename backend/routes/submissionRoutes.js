const express = require("express");
const mongoose = require("mongoose");
const Submission = require("../models/Submission");
const requireDatabase = require("../middleware/requireDatabase");
const validateSubmissionPayload = require("../utils/validateSubmissionPayload");
const { authenticate, optionalAuthenticate } = require("../middleware/authenticate");

const router = express.Router();
// POST /api/submissions - Persist a completed dynamic form submission.
router.post("/", optionalAuthenticate, requireDatabase, async (req, res) => {
  const validation = validateSubmissionPayload(req.body);
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: validation.error,
    });
  }


  try {
    const submission = await Submission.create({
      formId: req.body.formId.trim(),
      formTitle: req.body.formTitle.trim(),
      data: req.body.data,
      ownerId: req.user?.id || null,
    });

    return res.status(201).json({
      success: true,
      message: "Form submission saved successfully",
      data: {
        id: submission._id,
        formId: submission.formId,
        formTitle: submission.formTitle,
        createdAt: submission.createdAt,
      },
    });
  } catch (error) {
    console.error("Create submission error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to save form submission",
    });
  }
});

// GET /api/submissions - List submissions owned by the signed-in user.
// Only summary fields are returned here; full submission data is loaded on demand.
router.get("/", authenticate, requireDatabase, async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 10));
  const search = typeof req.query.search === "string" ? req.query.search.trim().slice(0, 100) : "";
  const filter = { ownerId: req.user.id };

  if (search) {
    filter.$or = [
      { formTitle: { $regex: escapeRegex(search), $options: "i" } },
      { formId: { $regex: escapeRegex(search), $options: "i" } },
    ];
  }

  try {
    const [submissions, total] = await Promise.all([
      Submission.find(filter)
        .select("formId formTitle createdAt updatedAt")
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Submission.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: submissions.map((submission) => ({
        id: String(submission._id),
        formId: submission.formId,
        formTitle: submission.formTitle,
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    console.error("List submissions error:", error.message);
    return res.status(500).json({
      success: false,
      code: "SUBMISSIONS_LIST_FAILED",
      message: "Failed to load your submissions.",
    });
  }
});

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// GET /api/submissions/:id - Retrieve a submission by its ID.
router.get("/:id", authenticate, requireDatabase, async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid submission ID" });
  }


  try {
    const filter = req.user.role === "admin"
      ? { _id: req.params.id }
      : { _id: req.params.id, ownerId: req.user.id };
    const submission = await Submission.findOne(filter);
    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    return res.status(200).json({ success: true, data: submission });
  } catch (error) {
    console.error("Get submission error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to retrieve submission" });
  }
});

module.exports = router;
