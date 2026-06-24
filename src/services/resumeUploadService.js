import User from "../models/User.js";

import ErrorResponse from "../utils/errorResponse.js";

import { uploadFileToCloudinary } from "./uploadService.js";

import { parseResume } from "./resumeParserService.js";

import extractSkills from "../utils/extractSkills.js";

// UPLOAD RESUME SERVICE
export const uploadResumeService = async (userId, fileBuffer) => {
  const parserBuffer = Buffer.from(fileBuffer);

  const [resumeText, uploadResult] = await Promise.all([
    parseResume(parserBuffer),

    uploadFileToCloudinary(fileBuffer, {
      folder: "internpath/resumes",
      resourceType: "raw",
      format: "pdf",
    }),
  ]);

  const resumeUrl = uploadResult.secure_url;

  const skills = extractSkills(resumeText);

  const updatedUser = await User.findByIdAndUpdate(
    userId,

    {
      resumeUrl,
      resumeText,
      skills,
      $inc: {
        resumeVersion: 1,
      },
    },

    { new: true },
  ).select("-password");

  if (!updatedUser) {
    throw new ErrorResponse("User not found", 404);
  }

  return updatedUser;
};
