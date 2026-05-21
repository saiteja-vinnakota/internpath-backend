import SavedJob
from "../models/SavedJob.js";

import Job
from "../models/Job.js";

import ErrorResponse
from "../utils/errorResponse.js";




// Save Job
export const saveJob =
  async (
    studentId,
    jobId
  ) => {

    // Check Job Exists
    const job =
      await Job.findById(
        jobId
      );


    if (!job) {

      throw new ErrorResponse(
        "Job not found",
        404
      );
    }


    // Prevent Duplicate Save
    const existingSavedJob =
      await SavedJob.findOne({

        student: studentId,

        job: jobId
      });


    if (existingSavedJob) {

      throw new ErrorResponse(
        "Job already saved",
        400
      );
    }


    // Save Job
    const savedJob =
      await SavedJob.create({

        student: studentId,

        job: jobId
      });


    return savedJob;
  };




// Remove Saved Job
export const removeSavedJob =
  async (
    studentId,
    jobId
  ) => {

    const savedJob =
      await SavedJob.findOne({

        student: studentId,

        job: jobId
      });


    if (!savedJob) {

      throw new ErrorResponse(
        "Saved job not found",
        404
      );
    }


    await savedJob.deleteOne();


    return {
      message:
        "Saved job removed successfully"
    };
  };




// Get Saved Jobs
export const getSavedJobs =
  async (studentId) => {

    return await SavedJob
      .find({
        student: studentId
      })
      .populate("job")
      .sort({
        createdAt: -1
      });
  };