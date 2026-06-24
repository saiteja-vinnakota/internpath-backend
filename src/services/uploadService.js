import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import ErrorResponse from "../utils/errorResponse.js";

// UPLOAD FILE TO CLOUDINARY
export const uploadFileToCloudinary = async (buffer, options = {}) => {
  const {
    folder = "internpath",
    resourceType = "auto",
    format = null,
    type = "upload",
  } = options;

  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: resourceType,
      type,
    };

    if (format) {
      uploadOptions.format = format;
    }

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error("Cloudinary error:", error);
          reject(new ErrorResponse("File upload failed", 500));
        } else {
          console.log("Cloudinary result:", result);
          resolve(result);
        }
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};
