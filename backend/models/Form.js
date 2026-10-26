
const mongoose = require("mongoose");

const formSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    schema: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Form", formSchema);
