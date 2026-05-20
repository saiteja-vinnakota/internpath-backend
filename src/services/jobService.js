import Job from "../models/Job.js";

import ErrorResponse
from "../utils/errorResponse.js";

import APIFeatures
from "../utils/apiFeatures.js";



// Create Job
export const createJob = async (
  jobData,
  recruiterId
) => {

  const job = await Job.create({
    ...jobData,
    createdBy: recruiterId
  });

  return job;
};



// Get All Jobs
export const getAllJobs = async (
  queryString
) => {

  const features =
    new APIFeatures(
      Job.find({ isActive: true }),
      queryString
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

  const jobs =
    await features.query.populate(
      "createdBy",
      "name email"
    );

  return jobs;
};



// Get Single Job
export const getSingleJob = async (
  jobId
) => {

  const job = await Job.findById(
    jobId
  ).populate(
    "createdBy",
    "name email"
  );

  if (!job) {

    throw new ErrorResponse(
      "Job not found",
      404
    );
  }

  return job;
};



// Update Job
export const updateJob = async (
  jobId,
  recruiterId,
  updateData
) => {

  const job = await Job.findById(
    jobId
  );

  if (!job) {

    throw new ErrorResponse(
      "Job not found",
      404
    );
  }


  // Check Ownership
  if (
    job.createdBy.toString() !==
    recruiterId.toString()
  ) {

    throw new ErrorResponse(
      "Not authorized to update this job",
      403
    );
  }


  const updatedJob =
    await Job.findByIdAndUpdate(
      jobId,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

  return updatedJob;
};



// Delete Job
export const deleteJob = async (
  jobId,
  recruiterId
) => {

  const job = await Job.findById(
    jobId
  );

  if (!job) {

    throw new ErrorResponse(
      "Job not found",
      404
    );
  }


  // Check Ownership
  if (
    job.createdBy.toString() !==
    recruiterId.toString()
  ) {

    throw new ErrorResponse(
      "Not authorized to delete this job",
      403
    );
  }


  // Soft Delete
  job.isActive = false;

  await job.save();

  return;
};