import mongoose from "mongoose";

import {
  APPLICATION_STATUS
} from "../constants/applicationStatus.js";


const applicationSchema =
  new mongoose.Schema(
    {

      // Student Who Applied
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
      },



      // Job Applied To
      job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
        index: true
      },



      // Application Status
      status: {
        type: String,

        enum: [
          APPLICATION_STATUS.APPLIED,
          APPLICATION_STATUS.REVIEWING,
          APPLICATION_STATUS.SHORTLISTED,
          APPLICATION_STATUS.REJECTED,
          APPLICATION_STATUS.ACCEPTED
        ],

        default:
          APPLICATION_STATUS.APPLIED
      },



      // AI Match Score
      aiMatchScore: {
        type: Number,
        default: null
      },



      // Matched Skills
      matchedSkills: {
        type: [String],
        default: []
      },



      // Missing Skills
      missingSkills: {
        type: [String],
        default: []
      },



      // AI Suggestion
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