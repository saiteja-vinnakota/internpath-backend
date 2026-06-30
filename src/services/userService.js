import User from "../models/User.js";

import ErrorResponse from "../utils/errorResponse.js";

import { uploadFileToCloudinary } from "./uploadService.js";

// UPLOAD PROFILE PICTURE
export const uploadProfilePictureService = async (userId, fileBuffer) => {
  const uploadResult = await uploadFileToCloudinary(fileBuffer, {
    folder: "internpath/profile-pictures",
    resourceType: "auto",
  });

  const profileUrl = uploadResult.secure_url;

  const updatedUser = await User.findByIdAndUpdate(
    userId,

    {
      profilePicture: profileUrl,
    },

    { new: true },
  ).select("-password");

  if (!updatedUser) {
    throw new ErrorResponse("User not found", 404);
  }

  return updatedUser;
};

// GET CURRENT USER PROFILE
export const getMyProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }

  return user;
};

// UPDATE PROFILE
export const updateProfile = async (userId, updateData) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }

  // ALLOWED FIELDS
  const allowedFields = [
    // COMMON
    "name",
    "bio",
    "location",
    "linkedin",
    "profilePicture",

    // STUDENT
    "skills",
    "careerInterests",
    "achievements",
    "college",
    "github",

    // RECRUITER
    "company",
    "designation",
    "companyWebsite",
  ];

  // UPDATE SAFE FIELDS ONLY
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      user[field] = updateData[field];
    }
  });

  await user.save();

  return await User.findById(userId).select("-password");
};

// GET PUBLIC USER PROFILE
export const getPublicProfile = async (userId) => {
  const user = await User.findById(userId)

    .select("-password -email");

  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }

  return user;
};
