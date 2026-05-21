import Application from "../models/Application.js";

import Job from "../models/Job.js";

import User from "../models/User.js";

import MatchCache from "../models/MatchCache.js";

import ErrorResponse from "../utils/errorResponse.js";

import { createNotification } from "./notificationService.js";




// Apply To Job
export const applyToJob = async (
  studentId,
  jobId,
) => {

  // Check Job Exists
  const job =
    await Job.findById(
      jobId,
    );


  if (!job) {

    throw new ErrorResponse(
      "Job not found",
      404,
    );
  }


  // Check Student Exists
  const student =
    await User.findById(
      studentId,
    );


  if (!student) {

    throw new ErrorResponse(
      "Student not found",
      404,
    );
  }


  // Resume Required
  if (!student.resumeUrl) {

    throw new ErrorResponse(
      "Upload resume before applying",
      400,
    );
  }


  // Prevent Duplicate Application
  const existingApplication =
    await Application.findOne({

      student: studentId,

      job: jobId,
    });


  if (existingApplication) {

    throw new ErrorResponse(
      "Already applied to this job",
      400,
    );
  }


  // Fetch AI Match Cache
  const matchCache =
    await MatchCache.findOne({

      student: studentId,

      job: jobId,
    });


  // Create Application
  const application =
    await Application.create({

      student: studentId,

      job: jobId,

      resumeUrl:
        student.resumeUrl,



      // AI Snapshot
      matchScore:
        matchCache?.score || 0,

      matchedSkills:
        matchCache?.matchedSkills || [],

      missingSkills:
        matchCache?.missingSkills || [],

      aiSuggestion:
        matchCache?.suggestion || "",
    });


  // Create Student Notification
  await createNotification(

    studentId,

    `Successfully applied for ${job.title}`,

    "APPLICATION",

    jobId,
  );


  return application;
};




// Get Logged-In Student Applications
export const getMyApplications =
  async (studentId) => {

    return await Application
      .find({

        student: studentId,
      })
      .populate("job")
      .sort({
        createdAt: -1,
      });
  };




// Get Applicants For Recruiter Job
export const getJobApplicants =
  async (
    jobId,
    recruiterId,
  ) => {

    // Verify Job Ownership
    const job =
      await Job.findById(
        jobId,
      );


    if (!job) {

      throw new ErrorResponse(
        "Job not found",
        404,
      );
    }


    if (
      job.createdBy.toString()
      !== recruiterId.toString()
    ) {

      throw new ErrorResponse(
        "Not authorized",
        403,
      );
    }


    return await Application
      .find({
        job: jobId,
      })
      .populate(
        "student",
        "name email skills resumeUrl",
      )
      .sort({
        matchScore: -1,
      });
  };




// Update Application Status
export const updateApplicationStatus =
  async (
    applicationId,
    recruiterId,
    status,
  ) => {

    const application =
      await Application
        .findById(
          applicationId,
        )
        .populate("job");


    if (!application) {

      throw new ErrorResponse(
        "Application not found",
        404,
      );
    }


    // Verify Recruiter Owns Job
    if (
      application.job.createdBy.toString()
      !== recruiterId.toString()
    ) {

      throw new ErrorResponse(
        "Not authorized",
        403,
      );
    }


    // Update Status
    application.status = status;

    await application.save();


    // Notification Message
    let message = "";

    let notificationType =
      "SYSTEM";


    if (
      status === "shortlisted"
    ) {

      message =
        `You were shortlisted for ${application.job.title}`;

      notificationType =
        "SHORTLIST";
    }


    if (
      status === "rejected"
    ) {

      message =
        `Your application was rejected for ${application.job.title}`;

      notificationType =
        "REJECT";
    }


    if (
      status === "accepted"
    ) {

      message =
        `You were accepted for ${application.job.title}`;

      notificationType =
        "SYSTEM";
    }


    // Create Notification
    if (message) {

      await createNotification(

        application.student,

        message,

        notificationType,

        application.job._id,
      );
    }


    return application;
  };