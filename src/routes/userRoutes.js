import express from "express";

import {
  getMe,
  updateMe,
  getUserProfile,
  uploadProfilePicture,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";

import authorizeRoles from "../middleware/roleMiddleware.js";

import validate from "../middleware/validateMiddleware.js";

import imageUpload from "../middleware/imageUploadMiddleware.js";

import { validateProfilePictureUpload } from "../validators/profileValidator.js";

import { idParamsSchema } from "../validators/commonValidator.js";

import { updateProfileSchema } from "../validators/userValidator.js";

import { ROLES } from "../constants/roles.js";

const router = express.Router();

// Current Logged-In User
router.get(
  "/me",

  protect,

  getMe,
);

// Update Logged-In User
router.put(
  "/me",

  protect,

  validate(updateProfileSchema),

  updateMe,
);

// Public User Profile
router.get(
  "/:id",

  validate(idParamsSchema),

  getUserProfile,
);

// Upload Profile Picture
router.post(
  "/upload-profile-picture",

  protect,

  authorizeRoles(ROLES.STUDENT, ROLES.RECRUITER),

  imageUpload.single("profilePicture"),

  validateProfilePictureUpload,

  uploadProfilePicture,
);

export default router;
