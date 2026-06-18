import mongoose from "mongoose";

const jobSchema =
  new mongoose.Schema(
    {

      title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
        index: true,
      },

      company: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },

      description: {
        type: String,
        required: true,
      },

      category: {
        type: String,
        trim: true,
      },

      requiredSkills: {
        type: [String],
        default: [],
      },

      perks: {
        type: [String],
        default: [],
      },

      location: {
        type: String,
        required: true,
        trim: true,
      },

      mode: {
        type: String,
        enum: [
          "remote",
          "hybrid",
          "onsite",
        ],
        default: "remote",
      },

      stipend: {
        type: Number,
        default: 0,
      },

      duration: {
        type: String,
        trim: true,
      },

      openingsCount: {
        type: Number,
        default: 1,
        min: 1,
      },

      startDate: {
        type: Date,
      },

      deadline: {
        type: Date,
      },

      eligibleBatches: {
        type: [String],
        default: [],
      },

      eligibleDegrees: {
        type: [String],
        default: [],
      },

      minimumCGPA: {
        type: Number,
        min: 0,
        max: 10,
      },

      status: {
        type: String,
        enum: [
          "active",
          "closed",
          "draft",
        ],
        default: "active",
      },

      featured: {
        type: Boolean,
        default: false,
      },

      createdBy: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        required: true,
      },

      isActive: {
        type: Boolean,
        default: true,
      },

    },
    {
      timestamps: true,
    }
  );

const Job =
  mongoose.model(
    "Job",
    jobSchema
  );

export default Job;