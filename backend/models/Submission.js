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
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
  },
  { timestamps: true }
);

submissionSchema.index({ ownerId: 1, createdAt: -1 });

module.exports = mongoose.model("Submission", submissionSchema);
