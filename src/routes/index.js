import express from "express";

import authRoutes
from "./authRoutes.js";

import jobRoutes
from "./jobRoutes.js";

import applicationRoutes
from "./applicationRoutes.js";

import resumeRoutes
from "./resumeRoutes.js";

import aiRoutes
from "./aiRoutes.js";

const router = express.Router();


router.use(
  "/auth",
  authRoutes
);

router.use(
  "/jobs",
  jobRoutes
);

router.use(
  "/applications",
  applicationRoutes
);

router.use(
  "/resume",
  resumeRoutes
);

router.use(
  "/ai",
  aiRoutes
);

export default router;