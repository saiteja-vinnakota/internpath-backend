import express from "express";

import {

  register,
  login,
  getMe

} from "../controllers/authController.js";

import {
  protect
} from "../middleware/authMiddleware.js";

import validate
from "../middleware/validateMiddleware.js";

import {
  authLimiter
} from "../middleware/rateLimiter.js";

import {

  registerSchema,
  loginSchema

} from "../validators/authValidator.js";


const router =
  express.Router();




// Register User
router.post(

  "/register",

  authLimiter,

  validate(
    registerSchema
  ),

  register
);




// Login User
router.post(

  "/login",

  authLimiter,

  validate(
    loginSchema
  ),

  login
);




// Current Logged-in User
router.get(

  "/me",

  protect,

  getMe
);


export default router;