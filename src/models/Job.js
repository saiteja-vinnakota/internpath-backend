import mongoose from "mongoose";

import { JOB_TYPES }
from "../constants/jobTypes.js";

import { ROLES }
from "../constants/roles.js";


const jobSchema = new mongoose.Schema(
  {

    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: 100,
      index: true
    },

    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: 100
    },

    description: {
      type: String,
      required: [true, "Description is required"]
    },

    requiredSkills: {
      type: [String],
      required: true,
      default: []
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      enum: [
        JOB_TYPES.REMOTE,
        JOB_TYPES.ONSITE,
        JOB_TYPES.HYBRID
      ],
      default: JOB_TYPES.REMOTE
    },

    stipend: {
      type: Number,
      default: 0
    },

    deadline: {
      type: Date
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);


const Job =
  mongoose.model("Job", jobSchema);

export default Job;