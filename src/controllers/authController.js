import asyncHandler
from "../utils/asyncHandler.js";

import {
  registerUser,
  loginUser
} from "../services/authService.js";

import {
  successResponse
} from "../utils/responseFormatter.js";



// Register Controller
export const register = asyncHandler(
  async (req, res) => {

    const result =
      await registerUser(req.body);

    successResponse(
      res,
      "User registered successfully",
      result,
      201
    );
  }
);



// Login Controller
export const login = asyncHandler(
  async (req, res) => {

    const { email, password } =
      req.body;

    const result =
      await loginUser(
        email,
        password
      );

    successResponse(
      res,
      "Login successful",
      result,
      200
    );
  }
);



// Current Logged-in User
export const getMe = asyncHandler(
  async (req, res) => {

    successResponse(
      res,
      "User fetched successfully",
      req.user,
      200
    );
  }
);