import express from "express";

import {
  register,
  login,
  getMe
} from "../controllers/authController.js";

import {
  protect
} from "../middleware/authMiddleware.js";

import {
  validateRegister,
  validateLogin
} from "../validators/authValidator.js";

const router = express.Router();


// Register User
router.post(
  "/register",
  validateRegister,
  register
);


// Login User
router.post(
  "/login",
  validateLogin,
  login
);


// Current Logged-in User
router.get(
  "/me",
  protect,
  getMe
);


export default router;