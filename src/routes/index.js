import express from "express";

import authRoutes
from "./authRoutes.js";

import jobRoutes
from "./jobRoutes.js";

const router = express.Router();


router.use(
  "/auth",
  authRoutes
);

router.use(
  "/jobs",
  jobRoutes
);

export default router;