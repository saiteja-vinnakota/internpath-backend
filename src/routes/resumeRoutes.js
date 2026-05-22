import express from "express";

import {
  uploadResume
} from "../controllers/resumeController.js";

import {
  protect
} from "../middleware/authMiddleware.js";

import authorizeRoles
from "../middleware/roleMiddleware.js";

import upload
from "../middleware/uploadMiddleware.js";

import {
  ROLES
} from "../constants/roles.js";

import {
  validateResumeUpload
} from "../validators/resumeValidator.js";


const router =
  express.Router();




// Upload Resume
router.post(

  "/upload",

  protect,

  authorizeRoles(
    ROLES.STUDENT
  ),

  upload.single(
    "resume"
  ),

  validateResumeUpload,

  uploadResume
);


export default router;