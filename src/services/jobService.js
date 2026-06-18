import Job from "../models/Job.js";

import Application from "../models/Application.js";

import ErrorResponse from "../utils/errorResponse.js";

// CREATE JOB
export const createJob = async (jobData, recruiterId) => {
  const job = await Job.create({
    ...jobData,

    createdBy: recruiterId,
  });

  return job;
};

// GET ALL JOBS
export const getAllJobs = async (queryParams) => {
  // PAGINATION
  const page = Number(queryParams.page) || 1;

  const limit = Number(queryParams.limit) || 10;

  const skip = (page - 1) * limit;

  // SEARCH
  const keyword = queryParams.keyword || "";

  // FILTERS
  const filters = {
    isActive: true,
    status: "active",
  };

  // KEYWORD SEARCH
  if (keyword) {
    filters.$or = [
      {
        title: {
          $regex: keyword,
          $options: "i",
        },
      },

      {
        company: {
          $regex: keyword,
          $options: "i",
        },
      },

      {
        requiredSkills: {
          $regex: keyword,
          $options: "i",
        },
      },

      {
        category: {
          $regex: keyword,
          $options: "i",
        },
      },
    ];
  }

  // LOCATION
  if (queryParams.location) {
    filters.location = {
      $regex: queryParams.location,

      $options: "i",
    };
  }

  // MODE
  if (queryParams.mode) {
    filters.mode = queryParams.mode;
  }

  // CATEGORY
  if (queryParams.category) {
    filters.category = {
      $regex: queryParams.category,

      $options: "i",
    };
  }

  // STIPEND
  if (queryParams.stipend) {
    filters.stipend = {
      $gte: Number(queryParams.stipend),
    };
  }

  // DURATION
  if (queryParams.duration) {
    filters.duration = {
      $regex: `^${queryParams.duration}$`,
      $options: "i",
    };
  }

  // BATCH
  if (queryParams.batch) {
    filters.eligibleBatches = queryParams.batch;
  }

  // SORT
  let sortOption = {
    createdAt: -1,
  };

  if (queryParams.sort === "stipend") {
    sortOption = {
      stipend: -1,
    };
  }

  if (queryParams.sort === "deadline") {
    sortOption = {
      deadline: 1,
    };
  }

  if (queryParams.sort === "oldest") {
    sortOption = {
      createdAt: 1,
    };
  }

  // FETCH JOBS
  const jobs = await Job.find(filters)

    .populate("createdBy", "name email")

    .sort(sortOption)

    .skip(skip)

    .limit(limit);

  // TOTAL COUNT
  const totalJobs = await Job.countDocuments(filters);

  // PAGINATION
  const pagination = {
    totalJobs,

    currentPage: page,

    totalPages: Math.ceil(totalJobs / limit),

    limit,
  };

  return {
    jobs,

    pagination,
  };
};

// GET SINGLE JOB
export const getSingleJob = async (jobId) => {
  const job = await Job.findById(jobId).populate("createdBy", "name email");

  if (!job) {
    throw new ErrorResponse("Job not found", 404);
  }

  return job;
};

// UPDATE JOB
export const updateJob = async (jobId, recruiterId, updateData) => {
  const job = await Job.findById(jobId);

  if (!job) {
    throw new ErrorResponse("Job not found", 404);
  }

  // OWNERSHIP CHECK
  if (job.createdBy.toString() !== recruiterId.toString()) {
    throw new ErrorResponse("Not authorized to update this job", 403);
  }

  const updatedJob = await Job.findByIdAndUpdate(
    jobId,

    updateData,

    {
      new: true,

      runValidators: true,
    },
  );

  return updatedJob;
};

// DELETE JOB
export const deleteJob = async (jobId, recruiterId) => {
  const job = await Job.findById(jobId);

  if (!job) {
    throw new ErrorResponse("Job not found", 404);
  }

  // OWNERSHIP CHECK
  if (job.createdBy.toString() !== recruiterId.toString()) {
    throw new ErrorResponse("Not authorized to delete this job", 403);
  }

  // SOFT DELETE
  job.isActive = false;

  await job.save();
};

// GET RECRUITER JOBS
export const getJobsByRecruiter = async (recruiterId) => {
  const jobs = await Job.find({
    createdBy: recruiterId,

    isActive: true,
  })

    .sort({
      createdAt: -1,
    });

  // ADD APPLICATION COUNTS
  const jobsWithCounts = await Promise.all(
    jobs.map(async (job) => {
      const applicationsCount = await Application.countDocuments({
        job: job._id,
      });

      return {
        ...job.toObject(),

        applicationsCount,
      };
    }),
  );

  return jobsWithCounts;
};

// CLOSE JOB
export const closeJob = async (jobId, recruiterId) => {
  const job = await Job.findById(jobId);

  if (!job) {
    throw new ErrorResponse("Job not found", 404);
  }

  if (job.createdBy.toString() !== recruiterId.toString()) {
    throw new ErrorResponse("Not authorized to close this job", 403);
  }

  job.status = "closed";

  await job.save();

  return job;
};

// CLOSE EXPIRED JOBS
export const closeExpiredJobs = async () => {
  const now = new Date();

  const result = await Job.updateMany(
    {
      isActive: true,
      status: "active",
      deadline: { $lte: now },
    },
    {
      $set: { status: "closed" },
    },
  );

  return result;
};
