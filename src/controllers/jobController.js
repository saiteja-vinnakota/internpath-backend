import asyncHandler from "../utils/asyncHandler.js";

import {
  createJob,
  getAllJobs,
  getSingleJob,
  updateJob,
  closeJob,
  deleteJob,
  getJobsByRecruiter,
} from "../services/jobService.js";

import { successResponse } from "../utils/responseFormatter.js";

// Create Job
export const create = asyncHandler(async (req, res) => {
  const result = await createJob(req.body, req.user._id);

  successResponse(res, "Job created successfully", result, 201);
});

// Get All Jobs
export const getAll = asyncHandler(async (req, res) => {
  const result = await getAllJobs(req.query);
  successResponse(res, "Jobs fetched successfully", result, 200);
});

// Recruiter Own Jobs
export const getRecruiterJobs = asyncHandler(async (req, res) => {
  const result = await getJobsByRecruiter(req.user._id);

  successResponse(
    res,

    "Recruiter jobs fetched successfully",

    result,

    200,
  );
});

// Get Single Job
export const getOne = asyncHandler(async (req, res) => {
  const result = await getSingleJob(req.params.id);

  successResponse(res, "Job fetched successfully", result, 200);
});

// Update Job
export const update = asyncHandler(async (req, res) => {
  const result = await updateJob(req.params.id, req.user._id, req.body);

  successResponse(res, "Job updated successfully", result, 200);
});

// CLOSE JOB
export const close = asyncHandler(async (req, res) => {
  const result = await closeJob(
    req.params.id,

    req.user._id,
  );

  successResponse(
    res,

    "Internship closed successfully",

    result,

    200,
  );
});

// Delete Job
export const remove = asyncHandler(async (req, res) => {
  await deleteJob(req.params.id, req.user._id);

  successResponse(res, "Job deleted successfully", {}, 200);
});
