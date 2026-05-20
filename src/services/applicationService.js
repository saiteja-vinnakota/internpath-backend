import Application
from "../models/Application.js";

import Job
from "../models/Job.js";

import MatchCache
from "../models/MatchCache.js";

import ErrorResponse
from "../utils/errorResponse.js";

import {
  APPLICATION_STATUS
} from "../constants/applicationStatus.js";




// Apply To Job
export const applyToJob = async (
  studentId,
  jobId
) => {

  // Check Job Exists
  const job = await Job.findById(jobId);

  if (!job || !job.isActive) {

    throw new ErrorResponse(
      "Job not found",
      404
    );
  }


  // Prevent Duplicate Applications
  const existingApplication =
    await Application.findOne({
      student: studentId,
      job: jobId
    });

  if (existingApplication) {

    throw new ErrorResponse(
      "You already applied to this job",
      400
    );
  }


  // Fetch AI Match Cache
  const matchCache =
    await MatchCache.findOne({
      student: studentId,
      job: jobId
    });


  // Create Application
  const application =
    await Application.create({

      student: studentId,

      job: jobId,

      status:
        APPLICATION_STATUS.APPLIED,

      aiMatchScore:
        matchCache?.score || null,

      matchedSkills:
        matchCache?.matchedSkills || [],

      missingSkills:
        matchCache?.missingSkills || [],

      aiSuggestion:
        matchCache?.suggestion || ""
    });


  return application;
};




// Student Applications
export const getMyApplications =
  async (studentId) => {

    const applications =
      await Application.find({
        student: studentId
      })
        .populate(
          "job"
        )
        .sort({
          createdAt: -1
        });

    return applications;
  };




// Recruiter Gets Applicants
export const getJobApplicants =
  async (jobId, recruiterId) => {

    // Verify Recruiter Owns Job
    const job =
      await Job.findById(jobId);

    if (!job) {

      throw new ErrorResponse(
        "Job not found",
        404
      );
    }


    if (
      job.createdBy.toString() !==
      recruiterId.toString()
    ) {

      throw new ErrorResponse(
        "Not authorized",
        403
      );
    }


    // Fetch Applicants
    const applications =
      await Application.find({
        job: jobId
      })
        .populate(
          "student",
          "name email skills resumeUrl"
        )
        .sort({
          aiMatchScore: -1
        });

    return applications;
  };




// Update Application Status
export const updateApplicationStatus =
  async (
    applicationId,
    recruiterId,
    status
  ) => {

    const application =
      await Application.findById(
        applicationId
      ).populate("job");


    if (!application) {

      throw new ErrorResponse(
        "Application not found",
        404
      );
    }


    // Verify Recruiter Owns Job
    if (
      application.job.createdBy.toString() !==
      recruiterId.toString()
    ) {

      throw new ErrorResponse(
        "Not authorized",
        403
      );
    }


    application.status = status;

    await application.save();

    return application;
  };