import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/responseFormatter.js";

import {
  applyToJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
} from "../services/applicationService.js";

// Apply To Job
export const apply = asyncHandler(async (req, res) => {
  const result = await applyToJob(req.user._id, req.params.jobId);
  successResponse(res, "Application submitted successfully", result, 201);
});

// Student Applications
export const getMine = asyncHandler(async (req, res) => {
  const result = await getMyApplications(req.user._id);
  successResponse(res, "Applications fetched successfully", result, 200);
});

// Recruiter Gets Applicants
export const getApplicants = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page || 1);
  const limit = parseInt(req.query.limit || 12);

  const result = await getJobApplicants(req.params.jobId, req.user._id, page, limit);
  successResponse(res, "Applicants fetched successfully", result, 200);
});

// Recruiter Updates Status
export const updateStatus = asyncHandler(async (req, res) => {
  const result = await updateApplicationStatus(
    req.params.applicationId,
    req.user._id,
    req.body.status
  );
  successResponse(res, "Application status updated successfully", result, 200);
});