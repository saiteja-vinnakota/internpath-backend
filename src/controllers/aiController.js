import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";
import { successResponse } from "../utils/responseFormatter.js";
import { generateAIMatch } from "../services/geminiService.js";
import MatchCache from "../models/MatchCache.js";
import User from "../models/User.js";
import Job from "../models/Job.js";

// GET AI MATCH — checks cache first, computes + saves if missing or stale
export const getAIJobMatch = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const studentId = req.user._id;
  const forceRefresh = req.query.refresh === "true";

  const student = await User.findById(studentId).select("resumeText resumeVersion resumeUrl");
  const job = await Job.findById(jobId).select("title description requiredSkills");

  if (!job) throw new ErrorResponse("Job not found", 404);

  if (!student?.resumeUrl || !student?.resumeText) {
    throw new ErrorResponse("Please upload your resume before checking match score", 400);
  }

  // ── CACHE CHECK ──
  // Cache is invalidated automatically if the student's resume version
  // changed since the score was last computed (they re-uploaded their resume).
  const existing = await MatchCache.findOne({ student: studentId, job: jobId });

  if (existing && !forceRefresh && existing.resumeVersion === student.resumeVersion) {
    return successResponse(res, "Match score retrieved", existing, 200);
  }

  // ── GENERATE NEW SCORE ──
  const jobDescriptionText = [
    job.title,
    job.description,
    job.requiredSkills?.length ? `Required skills: ${job.requiredSkills.join(", ")}` : "",
  ].filter(Boolean).join("\n\n");

  const aiResult = await generateAIMatch(student.resumeText, jobDescriptionText);

  // ── UPSERT CACHE ──
  const updated = await MatchCache.findOneAndUpdate(
    { student: studentId, job: jobId },
    {
      ...aiResult,
      resumeVersion: student.resumeVersion || 1,
    },
    { new: true, upsert: true }
  );

  successResponse(res, "Match score computed successfully", updated, 200);
});