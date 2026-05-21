import express from "express";

import {
  getAIJobMatch
} from "../controllers/aiController.js";

import {
  protect
} from "../middleware/authMiddleware.js";

import authorizeRoles
from "../middleware/roleMiddleware.js";

import {
  ROLES
} from "../constants/roles.js";


const router = express.Router();




// Get AI Match Score
router.get(

  "/match/:jobId",

  protect,

  authorizeRoles(
    ROLES.STUDENT
  ),

  getAIJobMatch
);


export default router;