import asyncHandler
from "../utils/asyncHandler.js";

import {

  getMyProfile,

  updateProfile,

  getPublicProfile,

} from "../services/userService.js";

import {
  successResponse,
} from "../utils/responseFormatter.js";

// GET CURRENT USER PROFILE
export const getMe =
  asyncHandler(

    async (req, res) => {

      const result =
        await getMyProfile(
          req.user._id
        );

      successResponse(

        res,

        "Profile fetched successfully",

        result,

        200
      );
    }
  );

// UPDATE CURRENT USER PROFILE
export const updateMe =
  asyncHandler(

    async (req, res) => {

      const result =
        await updateProfile(

          req.user._id,

          req.body
        );

      successResponse(

        res,

        "Profile updated successfully",

        result,

        200
      );
    }
  );

// GET PUBLIC USER PROFILE
export const getUserProfile =
  asyncHandler(

    async (req, res) => {

      const result =
        await getPublicProfile(
          req.params.id
        );

      successResponse(

        res,

        "User profile fetched successfully",

        result,

        200
      );
    }
  );