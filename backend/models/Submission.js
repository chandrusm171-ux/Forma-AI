const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    formId: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    formTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
