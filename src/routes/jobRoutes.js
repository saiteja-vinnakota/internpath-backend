import express from "express";

import {
  create,
  getAll,
  getOne,
  update,
  remove,
  close,
  getRecruiterJobs,
} from "../controllers/jobController.js";

import { protect } from "../middleware/authMiddleware.js";

import authorizeRoles from "../middleware/roleMiddleware.js";

import { ROLES } from "../constants/roles.js";

import validate from "../middleware/validateMiddleware.js";

import {
  createJobSchema,
  updateJobSchema,
} from "../validators/jobValidator.js";

import { idParamsSchema } from "../validators/commonValidator.js";

const router = express.Router();

router.get("/", getAll);

router.get(
  "/recruiter/me",

  protect,

  authorizeRoles(ROLES.RECRUITER),

  getRecruiterJobs,
);

router.get(
  "/:id",

  validate(idParamsSchema),

  getOne,
);

router.post(
  "/",

  protect,

  authorizeRoles(ROLES.RECRUITER),

  validate(createJobSchema),

  create,
);

router.put(
  "/:id",

  protect,

  authorizeRoles(ROLES.RECRUITER),

  validate(updateJobSchema),

  update,
);

router.put(
  "/:id/close",

  protect,

  authorizeRoles(ROLES.RECRUITER),

  validate(idParamsSchema),

  close,
);


router.delete(
  "/:id",

  protect,

  authorizeRoles(ROLES.RECRUITER),


  validate(idParamsSchema),

  remove,
);

export default router;
