import mongoose from "mongoose";

import {
  APPLICATION_STATUS
} from "../constants/applicationStatus.js";




const applicationSchema =
  new mongoose.Schema(
    {

      // Student
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },



      // Job
      job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
      },



      // Application Status
      status: {
        type: String,
        enum: Object.values(
          APPLICATION_STATUS
        ),
        default:
          APPLICATION_STATUS.APPLIED
      },



      // Resume Used During Apply
      resumeUrl: {
        type: String,
        default: ""
      },



      // AI Match Score Snapshot
      matchScore: {
        type: Number,
        default: 0
      },



      // Matched Skills Snapshot
      matchedSkills: {
        type: [String],
        default: []
      },



      // Missing Skills Snapshot
      missingSkills: {
        type: [String],
        default: []
      },



      // AI Suggestion Snapshot
      aiSuggestion: {
        type: String,
        default: ""
      }

    },
    {
      timestamps: true
    }
  );




// Prevent Duplicate Applications
applicationSchema.index(
  {
    student: 1,
    job: 1
  },
  {
    unique: true
  }
);




const Application =
  mongoose.model(
    "Application",
    applicationSchema
  );

export default Application;