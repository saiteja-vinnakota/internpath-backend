import validator from "validator";

import ErrorResponse
from "../utils/errorResponse.js";



// Validate Register
export const validateRegister = (
  req,
  res,
  next
) => {

  const {
    name,
    email,
    password,
    role
  } = req.body;


  // Name Validation
  if (
    !name ||
    name.trim().length < 2
  ) {

    return next(
      new ErrorResponse(
        "Name must be at least 2 characters",
        400
      )
    );
  }


  // Email Validation
  if (
    !email ||
    !validator.isEmail(email)
  ) {

    return next(
      new ErrorResponse(
        "Valid email is required",
        400
      )
    );
  }


  // Password Validation
  if (
    !password ||
    password.length < 6
  ) {

    return next(
      new ErrorResponse(
        "Password must be at least 6 characters",
        400
      )
    );
  }


  // Role Validation
  if (
    role !== "student" &&
    role !== "recruiter"
  ) {

    return next(
      new ErrorResponse(
        "Invalid role selected",
        400
      )
    );
  }


  next();
};




// Validate Login
export const validateLogin = (
  req,
  res,
  next
) => {

  const {
    email,
    password
  } = req.body;


  // Email Validation
  if (
    !email ||
    !validator.isEmail(email)
  ) {

    return next(
      new ErrorResponse(
        "Valid email is required",
        400
      )
    );
  }


  // Password Validation
  if (
    !password
  ) {

    return next(
      new ErrorResponse(
        "Password is required",
        400
      )
    );
  }


  next();
};