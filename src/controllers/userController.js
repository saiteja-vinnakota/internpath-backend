import asyncHandler from "../utils/asyncHandler.js";

import User from "../models/User.js";

import {
  getMyProfile,
  updateProfile,
  getPublicProfile,
  uploadProfilePictureService,
} from "../services/userService.js";

import { successResponse } from "../utils/responseFormatter.js";

// UPLOAD PROFILE PICTURE
export const uploadProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,

      message: "Profile picture is required",
    });
  }

  const result = await uploadProfilePictureService(
    req.user._id,
    req.file.buffer,
  );

  successResponse(
    res,

    "Profile picture uploaded successfully",

    result,

    200,
  );
});

// GET CURRENT USER PROFILE
export const getMe = asyncHandler(async (req, res) => {
  const result = await getMyProfile(req.user._id);

  successResponse(
    res,

    "Profile fetched successfully",

    result,

    200,
  );
});

// UPDATE CURRENT USER PROFILE
export const updateMe = asyncHandler(async (req, res) => {
  const result = await updateProfile(
    req.user._id,

    req.body,
  );

  successResponse(
    res,

    "Profile updated successfully",

    result,

    200,
  );
});

// GET PUBLIC USER PROFILE
export const getUserProfile = asyncHandler(async (req, res) => {
  const result = await getPublicProfile(req.params.id);

  successResponse(
    res,

    "User profile fetched successfully",

    result,

    200,
  );
});
