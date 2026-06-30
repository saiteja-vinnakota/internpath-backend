import mongoose from "mongoose";

const matchCacheSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    job:     { type: mongoose.Schema.Types.ObjectId, ref: "Job",  required: true, index: true },

    score: { type: Number, required: true, min: 0, max: 100 },

    matchedSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },

    // NEW — added for the improved prompt's "strengths" field
    strengths: { type: [String], default: [] },

    suggestion: { type: String, default: "" },

    resumeVersion: { type: Number, default: 1 },
  },
  { timestamps: true }
);

matchCacheSchema.index({ student: 1, job: 1 }, { unique: true });
matchCacheSchema.index({ score: -1 });

const MatchCache = mongoose.model("MatchCache", matchCacheSchema);
export default MatchCache;