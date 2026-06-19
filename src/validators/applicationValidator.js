import { z } from "zod";

import { objectIdSchema } from "./commonValidator.js";

import { APPLICATION_STATUS } from "../constants/applicationStatus.js";

// APPLY TO JOB
export const applyJobSchema = z.object({
  params: z.object({
    jobId: objectIdSchema,
  }),
});

// UPDATE APPLICATION STATUS
export const updateApplicationStatusSchema = z.object({
  params: z.object({
    applicationId: objectIdSchema,
  }),

  body: z.object({
    status: z.nativeEnum(APPLICATION_STATUS),
  }),
});
