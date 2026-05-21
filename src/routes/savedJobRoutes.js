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

  saveJobController
);




// Remove Saved Job
router.delete(

  "/:jobId",

  protect,

  authorizeRoles(
    ROLES.STUDENT
  ),

  removeSavedJobController
);


export default router;