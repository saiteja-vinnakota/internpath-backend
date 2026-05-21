import streamifier from "streamifier";

import asyncHandler
from "../utils/asyncHandler.js";

import User
from "../models/User.js";

import cloudinary
from "../config/cloudinary.js";

import {
  successResponse
} from "../utils/responseFormatter.js";

import {
  parseResume
} from "../services/resumeParserService.js";




// Upload Resume
export const uploadResume =
  asyncHandler(
    async (req, res) => {

      // Check File Exists
      if (!req.file) {

        return res.status(400).json({
          success: false,
          message:
            "Resume PDF is required"
        });
      }


      // Parse Resume Text Directly From Buffer
      const resumeText =
        await parseResume(
          req.file.buffer
        );


      // Upload PDF To Cloudinary
      const uploadResult =
        await new Promise(
          (resolve, reject) => {

            const stream =
              cloudinary.uploader.upload_stream(

                {
                  folder:
                    "internpath/resumes",

                  resource_type:
                    "raw",

                  format: "pdf"
                },

                (
                  error,
                  result
                ) => {

                  if (error) {

                    reject(error);

                  } else {

                    resolve(result);
                  }
                }
              );


            streamifier
              .createReadStream(
                req.file.buffer
              )
              .pipe(stream);
          }
        );


      // Cloudinary Resume URL
      const resumeUrl =
        uploadResult.secure_url;


      // Update User
      const updatedUser =
        await User.findByIdAndUpdate(

          req.user._id,

          {
            resumeUrl,
            resumeText,
            $inc:{
              resumeVersion: 1
            }
          },

          {
            new: true
          }
        ).select("-password");


      successResponse(
        res,
        "Resume uploaded successfully",
        updatedUser,
        200
      );
    }
  );