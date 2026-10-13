const express = require("express");
const mongoose = require("mongoose");
const Submission = require("../models/Submission");
const requireDatabase = require("../middleware/requireDatabase");
const validateSubmissionPayload = require("../utils/validateSubmissionPayload");

const router = express.Router();
router.use(requireDatabase);

// POST /api/submissions - Persist a completed dynamic form submission.
router.post("/", async (req, res) => {
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

// GET /api/submissions/:id - Retrieve a submission by its ID.
router.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid submission ID" });
  }


  try {
    const submission = await Submission.findById(req.params.id);
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
