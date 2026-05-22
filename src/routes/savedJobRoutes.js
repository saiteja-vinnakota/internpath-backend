import express from "express";

import {

  saveJobController,

  removeSavedJobController,

  getSavedJobsController

} from "../controllers/savedJobController.js";

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
  saveJobSchema
} from "../validators/savedJobValidator.js";


const router =
  express.Router();




// Get Saved Jobs
router.get(

  "/",

  protect,

  authorizeRoles(
    ROLES.STUDENT
  ),

  getSavedJobsController
);




// Save Job
router.post(

  "/:jobId",

  protect,

  authorizeRoles(
    ROLES.STUDENT
  ),

  validate(
    saveJobSchema
  ),

  saveJobController
);




// Remove Saved Job
router.delete(

  "/:jobId",

  protect,

  authorizeRoles(
    ROLES.STUDENT
  ),

  validate(
    saveJobSchema
  ),

  removeSavedJobController
);


export default router;