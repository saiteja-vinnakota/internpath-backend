import streamifier from "streamifier";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import { successResponse } from "../utils/responseFormatter.js";
import { parseResume } from "../services/resumeParserService.js";
import extractSkills from "../utils/extractSkills.js";

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Resume PDF is required",
    });
  }

  const originalBuffer = req.file.buffer;
  const parserBuffer = Buffer.from(originalBuffer);

  const [resumeText, uploadResult] = await Promise.all([
  parseResume(parserBuffer),
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "internpath/resumes",
        resource_type: "raw",
        format: "pdf",
        type: "upload",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary error:", error); // ← add this
          reject(error);
        } else {
          console.log("Cloudinary result:", result);  // ← add this
          resolve(result);
        }
      }
    );
    streamifier.createReadStream(originalBuffer).pipe(stream);
  }),
]);

console.log("Resume URL:", uploadResult.secure_url); // ← add this

  // ✅ Use secure_url directly — no transformation flags needed
  const resumeUrl = uploadResult.secure_url;

  const skills = extractSkills(resumeText);

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      resumeUrl,
      resumeText,
      skills,
      $inc: { resumeVersion: 1 },
    },
    { new: true }
  ).select("-password");

  successResponse(res, "Resume uploaded successfully", updatedUser, 200);
});