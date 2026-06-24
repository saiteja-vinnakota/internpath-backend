import asyncHandler from "../utils/asyncHandler.js";

import { successResponse } from "../utils/responseFormatter.js";

import { uploadResumeService } from "../services/resumeUploadService.js";

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,

      message: "Resume PDF is required",
    });
  }

  const result = await uploadResumeService(req.user._id, req.file.buffer);

  successResponse(
    res,

    "Resume uploaded successfully",

    result,

    200,
  );
});
