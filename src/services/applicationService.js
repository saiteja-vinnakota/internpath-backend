import Application from "../models/Application.js";

import Job from "../models/Job.js";

import User from "../models/User.js";

import MatchCache from "../models/MatchCache.js";

import ErrorResponse from "../utils/errorResponse.js";

import { APPLICATION_STATUS } from "../constants/applicationStatus.js";

import { NOTIFICATION_TYPES } from "../constants/notificationTypes.js";

import { createNotification } from "./notificationService.js";

import { sendEmail } from "./emailService.js";

import applicationStatusTemplate from "../templates/emails/applicationStatusEmail.js";


// VALID STATUS TRANSITIONS
const VALID_STATUS_FLOW = {
  [APPLICATION_STATUS.APPLIED]: [
    APPLICATION_STATUS.SHORTLISTED,
    APPLICATION_STATUS.REJECTED,
  ],

  [APPLICATION_STATUS.SHORTLISTED]: [
    APPLICATION_STATUS.INTERVIEW,
    APPLICATION_STATUS.REJECTED,
  ],

  [APPLICATION_STATUS.INTERVIEW]: [
    APPLICATION_STATUS.SELECTED,
    APPLICATION_STATUS.REJECTED,
  ],

  [APPLICATION_STATUS.SELECTED]: [],

  [APPLICATION_STATUS.REJECTED]: [],
};

// APPLY TO JOB
export const applyToJob = async (studentId, jobId) => {
 
  const cachedMatch = await MatchCache.findOne({ student: studentId, job: jobId });

  if (!cachedMatch) {
    const error = new ErrorResponse(
      "Please check your AI match score before applying to this internship",
      400
    );
    error.code = "MATCH_SCORE_REQUIRED"; 
    throw error;
  }

  // 2. Prevent duplicate applications
  const existing = await Application.findOne({ student: studentId, job: jobId });
  if (existing) {
    throw new ErrorResponse("You have already applied to this internship", 400);
  }

  // 3. Create the application with the server-verified score —
  //    matchScore is NEVER taken from request body, so it can't be spoofed
  //    and every recruiter sees a number computed the same way.
  const application = await Application.create({
    student: studentId,
    job: jobId,
    matchScore: cachedMatch.score,
    matchedSkills: cachedMatch.matchedSkills,
    missingSkills: cachedMatch.missingSkills,
    status: "applied",
  });

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

  let notificationType = NOTIFICATION_TYPES.SYSTEM;

  // SHORTLISTED
  if (newStatus === APPLICATION_STATUS.SHORTLISTED) {
    message = `You were shortlisted for ${application.job.title}`;
    notificationType = NOTIFICATION_TYPES.SHORTLISTED;
  }

  // INTERVIEW
  else if (newStatus === APPLICATION_STATUS.INTERVIEW) {
    message = `Interview round started for ${application.job.title}`;
    notificationType = NOTIFICATION_TYPES.INTERVIEW;
  }

  // SELECTED
  else if (newStatus === APPLICATION_STATUS.SELECTED) {
    message = `Congratulations! You were selected for ${application.job.title}`;
    notificationType = NOTIFICATION_TYPES.SELECTED;
  }

  // REJECTED
  else if (newStatus === APPLICATION_STATUS.REJECTED) {
    message = `Your application was not selected for ${application.job.title}`;
    notificationType = NOTIFICATION_TYPES.REJECTED;
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
