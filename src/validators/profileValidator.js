import ErrorResponse from "../utils/errorResponse.js";

// Profile Picture Upload Validator
export const validateProfilePictureUpload = (req, res, next) => {
  // File Required
  if (!req.file) {
    return next(
      new ErrorResponse(
        "Profile picture is required",

        400,
      ),
    );
  }

  // Image types only
  const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

  if (!allowedMimes.includes(req.file.mimetype)) {
    return next(
      new ErrorResponse(
        "Only JPEG, PNG, and WebP images are allowed",

        400,
      ),
    );
  }

  // Max 2MB
  if (req.file.size > 2 * 1024 * 1024) {
    return next(
      new ErrorResponse(
        "Profile picture must be less than 2MB",

        400,
      ),
    );
  }

  next();
};
