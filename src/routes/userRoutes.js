import express from "express";

import {

  getMe,

  updateMe,

  getUserProfile

} from "../controllers/userController.js";

import {
  protect
} from "../middleware/authMiddleware.js";

import validate
from "../middleware/validateMiddleware.js";

import {
  idParamsSchema
} from "../validators/commonValidator.js";

import {
  updateProfileSchema
} from "../validators/userValidator.js";


const router =
  express.Router();




// Current Logged-In User
router.get(

  "/me",

  protect,

  getMe
);




// Update Logged-In User
router.put(

  "/me",

  protect,

  validate(
    updateProfileSchema
  ),

  updateMe
);




// Public User Profile
router.get(

  "/:id",

  validate(
    idParamsSchema
  ),

  getUserProfile
);


export default router;