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
export const getAllJobs =
  async (queryParams) => {

    // Query Defaults
    const page =
      Number(queryParams.page) || 1;

    const limit =
      Number(queryParams.limit) || 10;

    const skip =
      (page - 1) * limit;


    // Search Keyword
    const keyword =
      queryParams.keyword || "";


    // Filters
    const filters = {

      isActive: true
    };


    // Search By Title/Company
    if (keyword) {

      filters.$or = [

        {
          title: {
            $regex: keyword,
            $options: "i"
          }
        },

        {
          company: {
            $regex: keyword,
            $options: "i"
          }
        },

        {
          requiredSkills: {
            $regex: keyword,
            $options: "i"
          }
        }
      ];
    }


    // Location Filter
    if (queryParams.location) {

      filters.location = {
        $regex: queryParams.location,
        $options: "i"
      };
    }


    // Job Type Filter
    if (queryParams.type) {

      filters.type =
        queryParams.type;
    }


    // Sorting
    let sortOption = {
      createdAt: -1
    };


    if (
      queryParams.sort ===
      "stipend"
    ) {

      sortOption = {
        stipend: -1
      };
    }


    if (
      queryParams.sort ===
      "oldest"
    ) {

      sortOption = {
        createdAt: 1
      };
    }


    // Fetch Jobs
    const jobs =
      await Job.find(filters)

        .populate(
          "createdBy",
          "name email"
        )

        .sort(sortOption)

        .skip(skip)

        .limit(limit);


    // Total Count
    const totalJobs =
      await Job.countDocuments(
        filters
      );


    // Pagination Metadata
    const pagination = {

      totalJobs,

      currentPage: page,

      totalPages:
        Math.ceil(
          totalJobs / limit
        ),

      limit
    };


    return {
      jobs,
      pagination
    };
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