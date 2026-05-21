import asyncHandler
from "../utils/asyncHandler.js";

import {
  successResponse
} from "../utils/responseFormatter.js";

import {

  saveJob,

  removeSavedJob,

  getSavedJobs

} from "../services/savedJobService.js";




// Save Job
export const saveJobController =
  asyncHandler(
    async (req, res) => {

      const result =
        await saveJob(

          req.user._id,

          req.params.jobId
        );


      successResponse(

        res,

        "Job saved successfully",

        result,

        201
      );
    }
  );




// Remove Saved Job
export const removeSavedJobController =
  asyncHandler(
    async (req, res) => {

      const result =
        await removeSavedJob(

          req.user._id,

          req.params.jobId
        );


      successResponse(

        res,

        result.message,

        null,

        200
      );
    }
  );




// Get Saved Jobs
export const getSavedJobsController =
  asyncHandler(
    async (req, res) => {

      const result =
        await getSavedJobs(
          req.user._id
        );


      successResponse(

        res,

        "Saved jobs fetched successfully",

        result,

        200
      );
    }
  );