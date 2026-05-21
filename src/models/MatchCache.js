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
        required: true,
        min: 0,
        max: 100
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
      },



      // Resume Version
      resumeVersion: {
        type: Number,
        default: 1
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




// Faster Recruiter Sorting
matchCacheSchema.index({
  score: -1
});




const MatchCache =
  mongoose.model(
    "MatchCache",
    matchCacheSchema
  );

export default MatchCache;