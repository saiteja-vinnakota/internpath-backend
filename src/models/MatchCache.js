import mongoose from "mongoose";


const matchCacheSchema =
  new mongoose.Schema(
    {

      // Student
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
      },



      // Job
      job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
        index: true
      },



      // AI Match Score
      score: {
        type: Number,
        required: true
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
      suggestion: {
        type: String,
        default: ""
      }
    },
    {
      timestamps: true
    }
  );




// Prevent Duplicate Cache Entries
matchCacheSchema.index(
  {
    student: 1,
    job: 1
  },
  {
    unique: true
  }
);


const MatchCache =
  mongoose.model(
    "MatchCache",
    matchCacheSchema
  );

export default MatchCache;