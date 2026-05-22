import User from "../models/User.js";

import generateToken from "../utils/generateToken.js";

import ErrorResponse from "../utils/errorResponse.js";

import { sendEmail } from "./emailService.js";

import studentWelcomeEmail from "../templates/emails/studentWelcomeEmail.js";

import recruiterWelcomeEmail from "../templates/emails/recruiterWelcomeEmail.js";

import { ROLES } from "../constants/roles.js";

// Register User
export const registerUser = async (userData) => {
  const { name, email, password, role } = userData;

  // Check Existing User
  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    throw new ErrorResponse(
      "User already exists",

      400,
    );
  }

  // Create User
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Generate JWT
  const token = generateToken(user._id);

  // Welcome Email Template
  let emailTemplate = "";

  if (user.role === ROLES.STUDENT) {
    emailTemplate = studentWelcomeEmail(user.name);
  }

  if (user.role === ROLES.RECRUITER) {
    emailTemplate = recruiterWelcomeEmail(user.name);
  }

  // Send Welcome Email
  try {
    await sendEmail(
      user.email,

      "Welcome to InternPath",

      emailTemplate,
    );
  } catch (error) {
    console.error(
      "Email sending failed:",

      error.message,
    );
  }

  // Return Response
  return {
    user: {
      id: user._id,

      name: user.name,

      email: user.email,

      role: user.role,
    },

    token,
  };
};

// Login User
export const loginUser = async (email, password) => {
  // Find User
  const user = await User.findOne({
    email,
  }).select("+password");

  // Check User Exists
  if (!user) {
    throw new ErrorResponse(
      "Invalid credentials",

      401,
    );
  }

  // Compare Password
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    throw new ErrorResponse(
      "Invalid credentials",

      401,
    );
  }

  // Generate JWT
  const token = generateToken(user._id);

  // Return Response
  return {
    user: {
      id: user._id,

      name: user.name,

      email: user.email,

      role: user.role,
    },

    token,
  };
};
