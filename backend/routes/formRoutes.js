


const express = require("express");
const Form = require("../models/Form");
const requireDatabase = require("../middleware/requireDatabase");
const validateFormSchema = require("../utils/validateFormSchema");

const router = express.Router();
router.use(requireDatabase);

// POST /api/forms - Create a new form
router.post("/", async (req, res) => {
  try {
    const { title, description, schema } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid form title is required",
      });
    }

    const validation = validateFormSchema(schema);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.error,
      });
    }

    const form = await Form.create({
      title: title.trim(),
      description,
      schema,
    });

    return res.status(201).json({
      success: true,
      message: "Form created successfully",
      data: form,
    });
  } catch (error) {
    console.error("Create form error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create form",
    });
  }
});

// GET /api/forms - Retrieve all forms
router.get("/", async (req, res) => {
  try {
    const forms = await Form.find()
      .select("title description createdAt updatedAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Forms retrieved successfully",
      count: forms.length,
      data: forms,
    });
  } catch (error) {
    console.error("Get all forms error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve forms",
    });
  }
});

// GET /api/forms/:id - Retrieve one form
router.get("/:id", async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Form retrieved successfully",
      data: form,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid form ID",
      });
    }

    console.error("Get form error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve form",
    });
  }
});

// DELETE /api/forms/:id - Delete one form
router.delete("/:id", async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Form deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid form ID",
      });
    }

    console.error("Delete form error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete form",
    });
  }
});

module.exports = router;
