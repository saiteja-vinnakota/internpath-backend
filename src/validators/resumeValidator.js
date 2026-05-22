import ErrorResponse
from "../utils/errorResponse.js";




// Resume Upload Validator
export const validateResumeUpload =
  (
    req,
    res,
    next
  ) => {

    // File Required
    if (!req.file) {

      return next(

        new ErrorResponse(

          "Resume PDF is required",

          400
        )
      );
    }


    // PDF Only
    if (
      req.file.mimetype !==
      "application/pdf"
    ) {

      return next(

        new ErrorResponse(

          "Only PDF files are allowed",

          400
        )
      );
    }


    // Max 5MB
    if (
      req.file.size >
      5 * 1024 * 1024
    ) {

      return next(

        new ErrorResponse(

          "Resume size cannot exceed 5MB",

          400
        )
      );
    }


    next();
  };