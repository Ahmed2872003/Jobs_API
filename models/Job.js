const mongoose = require("mongoose");

const JobsSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide a company name"],
      maxlength: 50,
    },

    position: {
      type: String,
      required: [true, "Please provide a position"],
      maxlength: 100,
    },

    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
  },
  { timestamps: true }
);

JobsSchema.index({ company: 1, position: 1, createdBy: 1 }, { unique: true });

module.exports = mongoose.model("Jobs", JobsSchema);
