import ErrorResponse
from "../utils/errorResponse.js";



// Validate Create Job
export const validateCreateJob = (
  req,
  res,
  next
) => {

  const {
    title,
    company,
    description,
    requiredSkills,
    location,
    stipend
  } = req.body;


  // Title Validation
  if (
    !title ||
    title.trim().length < 3
  ) {

    return next(
      new ErrorResponse(
        "Job title must be at least 3 characters",
        400
      )
    );
  }


  // Company Validation
  if (
    !company ||
    company.trim().length < 2
  ) {

    return next(
      new ErrorResponse(
        "Company name is required",
        400
      )
    );
  }


  // Description Validation
  if (
    !description ||
    description.trim().length < 20
  ) {

    return next(
      new ErrorResponse(
        "Description must be at least 20 characters",
        400
      )
    );
  }


  // Skills Validation
  if (
    !requiredSkills ||
    !Array.isArray(requiredSkills) ||
    requiredSkills.length === 0
  ) {

    return next(
      new ErrorResponse(
        "At least one skill is required",
        400
      )
    );
  }


  // Location Validation
  if (!location) {

    return next(
      new ErrorResponse(
        "Location is required",
        400
      )
    );
  }


  // Stipend Validation
  if (
    stipend &&
    stipend < 0
  ) {

    return next(
      new ErrorResponse(
        "Stipend cannot be negative",
        400
      )
    );
  }


  next();
};




// Validate Update Job
export const validateUpdateJob = (
  req,
  res,
  next
) => {

  const {
    stipend
  } = req.body;


  // Negative Stipend Check
  if (
    stipend &&
    stipend < 0
  ) {

    return next(
      new ErrorResponse(
        "Stipend cannot be negative",
        400
      )
    );
  }


  next();
};