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

import notificationRoutes
from "./notificationRoutes.js";

import savedJobRoutes
from "./savedJobRoutes.js";

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

router.use(
  "/notifications",
  notificationRoutes
);

router.use(
  "/saved-jobs",
  savedJobRoutes
);

export default router;