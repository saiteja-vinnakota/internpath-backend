import express from "express";

import {
  create,
  getAll,
  getOne,
  update,
  remove,
} from "../controllers/jobController.js";

import { protect } from "../middleware/authMiddleware.js";

import authorizeRoles from "../middleware/roleMiddleware.js";

import { ROLES } from "../constants/roles.js";

import {
  validateCreateJob,
  validateUpdateJob,
} from "../validators/jobValidator.js";

const router = express.Router();

// Public Routes

router.get("/", getAll);

router.get("/:id", getOne);

// Recruiter Protected Routes

router.post(
  "/",
  protect,
  authorizeRoles(ROLES.RECRUITER),
  validateCreateJob,
  create,
);

router.put("/:id", protect, authorizeRoles(ROLES.RECRUITER), validateUpdateJob, update);

router.delete("/:id", protect, authorizeRoles(ROLES.RECRUITER), remove);

export default router;
