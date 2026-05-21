import asyncHandler
from "../utils/asyncHandler.js";

import {
  successResponse
} from "../utils/responseFormatter.js";

import {
  getMatchScore
} from "../services/matchService.js";




// Get AI Match Score
export const getAIJobMatch =
  asyncHandler(
    async (req, res) => {

      const studentId =
        req.user._id;

      const { jobId } =
        req.params;


      // Get Match Result
      const result =
        await getMatchScore(

          studentId,

          jobId
        );


      successResponse(

        res,

        "AI match fetched successfully",

        result,

        200
      );
    }
  );