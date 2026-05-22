import express from "express";

import {

  apply,
  getMine,
  getApplicants,
  updateStatus

} from "../controllers/applicationController.js";

import {
  protect
} from "../middleware/authMiddleware.js";

import authorizeRoles
from "../middleware/roleMiddleware.js";

import {
  ROLES
} from "../constants/roles.js";

import validate
from "../middleware/validateMiddleware.js";

import {

  applyJobSchema,
  updateApplicationStatusSchema

} from "../validators/applicationValidator.js";


const router =
  express.Router();




// Student Applies To Job
router.post(

  "/:jobId",

  protect,

  authorizeRoles(
    ROLES.STUDENT
  ),

  validate(
    applyJobSchema
  ),

  apply
);




// Student Gets Own Applications
router.get(

  "/me",

  protect,

  authorizeRoles(
    ROLES.STUDENT
  ),

  getMine
);




// Recruiter Gets Applicants
router.get(

  "/job/:jobId",

  protect,

  authorizeRoles(
    ROLES.RECRUITER
  ),

  validate(
    applyJobSchema
  ),

  getApplicants
);




// Recruiter Updates Status
router.put(

  "/:applicationId/status",

  protect,

  authorizeRoles(
    ROLES.RECRUITER
  ),

  validate(
    updateApplicationStatusSchema
  ),

  updateStatus
);


export default router;