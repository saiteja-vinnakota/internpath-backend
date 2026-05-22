import User
from "../models/User.js";

import ErrorResponse
from "../utils/errorResponse.js";



// Get Current User Profile
export const getMyProfile =
  async (userId) => {

    const user =
      await User.findById(userId)
        .select("-password");


    if (!user) {

      throw new ErrorResponse(
        "User not found",
        404
      );
    }


    return user;
  };




// Update Profile
export const updateProfile =
  async (
    userId,
    updateData
  ) => {

    const user =
      await User.findById(userId);


    if (!user) {

      throw new ErrorResponse(
        "User not found",
        404
      );
    }


    // Update Fields
    Object.keys(updateData)
      .forEach((key) => {

        user[key] =
          updateData[key];
      });


    await user.save();


    return await User.findById(
      userId
    ).select("-password");
  };




// Get Public User Profile
export const getPublicProfile =
  async (userId) => {

    const user =
      await User.findById(userId)
        .select(
          "-password -email"
        );


    if (!user) {

      throw new ErrorResponse(
        "User not found",
        404
      );
    }


    return user;
  };