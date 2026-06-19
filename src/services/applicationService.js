import Application from "../models/Application.js";

import Job from "../models/Job.js";

import User from "../models/User.js";

import MatchCache from "../models/MatchCache.js";

import ErrorResponse from "../utils/errorResponse.js";

import { createNotification } from "./notificationService.js";

import { sendEmail } from "./emailService.js";

import applicationStatusTemplate from "../templates/emails/applicationStatusEmail.js";

// VALID STATUS TRANSITIONS
const VALID_STATUS_FLOW = {
  applied: ["shortlisted", "rejected"],

  shortlisted: ["interview", "rejected"],

  interview: ["selected", "rejected"],

  selected: [],

  rejected: [],
};

// APPLY TO JOB
export const applyToJob = async (studentId, jobId) => {
  // CHECK JOB
  const job = await Job.findById(jobId);

  if (!job) {
    throw new ErrorResponse("Job not found", 404);
  }

  // CHECK STUDENT
  const student = await User.findById(studentId);

  if (!student) {
    throw new ErrorResponse("Student not found", 404);
  }

  // RESUME REQUIRED
  if (!student.resumeUrl) {
    throw new ErrorResponse("Upload resume before applying", 400);
  }

  // PREVENT DUPLICATE
  const existingApplication = await Application.findOne({
    student: studentId,

    job: jobId,
  });

  if (existingApplication) {
    throw new ErrorResponse("Already applied to this internship", 400);
  }

  // AI CACHE
  const matchCache = await MatchCache.findOne({
    student: studentId,

    job: jobId,
  });

  // CREATE APPLICATION
  const application = await Application.create({
    student: studentId,

    job: jobId,

    resumeUrl: student.resumeUrl,

    status: "applied",

    // AI SNAPSHOT
    matchScore: matchCache?.score || 0,

    matchedSkills: matchCache?.matchedSkills || [],

    missingSkills: matchCache?.missingSkills || [],

    aiSuggestion: matchCache?.suggestion || "",
  });

  // NOTIFICATION
  await createNotification(
    studentId,

    `Successfully applied for ${job.title}`,

    "APPLICATION",

    jobId,
  );

  return application;
};

// GET MY APPLICATIONS
export const getMyApplications = async (studentId) => {
  return await Application.find({
    student: studentId,
  })

    .populate("job")

    .sort({
      createdAt: -1,
    });
};

// GET JOB APPLICANTS
export const getJobApplicants = async (
  jobId,
  recruiterId,
  page = 1,
  limit = 12,
) => {
  // VERIFY JOB
  const job = await Job.findById(jobId);

  if (!job) {
    throw new ErrorResponse("Internship not found", 404);
  }

  // OWNERSHIP CHECK
  if (job.createdBy.toString() !== recruiterId.toString()) {
    throw new ErrorResponse("Not authorized", 403);
  }

  // PAGINATION
  const skip = (page - 1) * limit;

  // TOTAL COUNT
  const total = await Application.countDocuments({
    job: jobId,
  });

  // FETCH APPLICANTS
  const data = await Application.find({
    job: jobId,
  })

    .populate(
      "student",
      `
          name
          email
          skills
          resumeUrl
          college
          bio
          github
          linkedin
          profilePicture
        `,
    )

    // BEST MATCH FIRST
    .sort({
      matchScore: -1,
    })
    .skip(skip)
    .limit(limit);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

// UPDATE APPLICATION STATUS
export const updateApplicationStatus = async (
  applicationId,
  recruiterId,
  newStatus,
) => {
  const application = await Application.findById(applicationId)

    .populate("job");

  if (!application) {
    throw new ErrorResponse("Application not found", 404);
  }

  // VERIFY OWNERSHIP
  if (application.job.createdBy.toString() !== recruiterId.toString()) {
    throw new ErrorResponse("Not authorized", 403);
  }

  // CURRENT STATUS
  const currentStatus = application.status;

  // VALID TRANSITIONS
  const allowedTransitions = VALID_STATUS_FLOW[currentStatus];

  // INVALID FLOW
  if (!allowedTransitions.includes(newStatus)) {
    throw new ErrorResponse(
      `Cannot move application from ${currentStatus} to ${newStatus}`,

      400,
    );
  }

  // UPDATE STATUS
  application.status = newStatus;

  await application.save();

  // NOTIFICATION MESSAGE
  let message = "";

  let notificationType = "SYSTEM";

  // NOTIFICATION MESSAGE
  let message = "";
  let notificationType = "SYSTEM";

  // SHORTLISTED
  if (newStatus === "shortlisted") {
    message = `You were shortlisted for ${application.job.title}`;
    notificationType = "SHORTLISTED";
  }

  // INTERVIEW
  else if (newStatus === "interview") {
    message = `Interview round started for ${application.job.title}`;
    notificationType = "INTERVIEW";
  }

  // SELECTED
  else if (newStatus === "selected") {
    message = `Congratulations! You were selected for ${application.job.title}`;
    notificationType = "SELECTED";
  }

  // REJECTED
  else if (newStatus === "rejected") {
    message = `Your application was not selected for ${application.job.title}`;
    notificationType = "REJECTED";
  }

  // CREATE NOTIFICATION
  if (message) {
    await createNotification(
      application.student,

      message,

      notificationType,

      application.job._id,
    );
  }

  // SEND EMAIL
  try {
    const student = await User.findById(application.student);

    if (student) {
      const emailHtml = applicationStatusTemplate(
        student.name,

        application.job.company,

        application.job.title,

        newStatus,
      );

      await sendEmail(
        student.email,

        "InternPath Application Update",

        emailHtml,
      );
    }
  } catch (error) {
    console.error(
      "Application status email failed:",

      error.message,
    );
  }

  return application;
};
