import express from "express";

import authRoutes
from "./authRoutes.js";

import jobRoutes
from "./jobRoutes.js";

import applicationRoutes
from "./applicationRoutes.js";

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


export default router;