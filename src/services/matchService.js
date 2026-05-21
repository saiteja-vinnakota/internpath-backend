import MatchCache
from "../models/MatchCache.js";

import User
from "../models/User.js";

import Job
from "../models/Job.js";

import {
  generateAIMatch
} from "./geminiService.js";




// Get AI Match Score
export const getMatchScore =
  async (
    studentId,
    jobId
  ) => {

    // Check Existing Cache
    const existingCache =
      await MatchCache.findOne({

        student: studentId,

        job: jobId
      });


    // Get Student
    const student =
      await User.findById(
        studentId
      );


    if (
      !student ||
      !student.resumeText
    ) {

      throw new Error(
        "Resume not uploaded"
      );
    }


    // Return Cache If Resume Version Matches
    if (
      existingCache &&
      existingCache.resumeVersion ===
      student.resumeVersion
    ) {

      return existingCache;
    }


    // Delete Old Outdated Cache
    if (
      existingCache &&
      existingCache.resumeVersion !==
      student.resumeVersion
    ) {

      await MatchCache.deleteOne({
        _id: existingCache._id
      });
    }


    // Get Job
    const job =
      await Job.findById(
        jobId
      );


    if (!job) {

      throw new Error(
        "Job not found"
      );
    }


    // Generate AI Match
    const aiResult =
      await generateAIMatch(

        student.resumeText,

        job.description
      );


    // Save Fresh Cache
    const savedCache =
      await MatchCache.create({

        student: studentId,

        job: jobId,

        score:
          aiResult.score,

        matchedSkills:
          aiResult.matchedSkills,

        missingSkills:
          aiResult.missingSkills,

        suggestion:
          aiResult.suggestion,

        resumeVersion:
          student.resumeVersion
      });


    return savedCache;
  };