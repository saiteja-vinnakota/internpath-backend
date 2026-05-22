import { z }
from "zod";

import {
  JOB_TYPES
} from "../constants/jobTypes.js";

import {
  objectIdSchema
} from "./commonValidator.js";


// Create Job Schema
export const createJobSchema =
  z.object({

    body: z.object({

      title:
        z.string()

          .min(
            3,
            "Title must be at least 3 characters"
          )

          .max(
            100,
            "Title cannot exceed 100 characters"
          ),




      company:
        z.string()

          .min(
            2,
            "Company name is required"
          ),




      description:
        z.string()

          .min(
            20,
            "Description too short"
          ),




      requiredSkills:
        z.array(
          z.string()
        )

          .min(
            1,
            "At least one skill required"
          ),




      location:
        z.string()

          .min(
            2,
            "Location is required"
          ),




      type:
        z.enum([

          JOB_TYPES.REMOTE,

          JOB_TYPES.ONSITE,

          JOB_TYPES.HYBRID
        ]),




      stipend:
        z.number()

          .min(
            0,
            "Stipend cannot be negative"
          ),




      deadline:
        z.string()

          .optional()
    })
  });

  // Update Job Schema
export const updateJobSchema =
  z.object({

    params: z.object({

      id: objectIdSchema
    }),

    body: z.object({

      title:
        z.string()

          .min(
            3,
            "Title must be at least 3 characters"
          )

          .max(
            100,
            "Title cannot exceed 100 characters"
          )

          .optional(),




      company:
        z.string()

          .min(
            2,
            "Company name is required"
          )

          .optional(),




      description:
        z.string()

          .min(
            20,
            "Description too short"
          )

          .optional(),




      requiredSkills:
        z.array(
          z.string()
        )

          .min(
            1,
            "At least one skill required"
          )

          .optional(),




      location:
        z.string()

          .min(
            2,
            "Location is required"
          )

          .optional(),




      type:
        z.enum([

          JOB_TYPES.REMOTE,

          JOB_TYPES.ONSITE,

          JOB_TYPES.HYBRID
        ])

          .optional(),




      stipend:
        z.number()

          .min(
            0,
            "Stipend cannot be negative"
          )

          .optional(),




      deadline:
        z.string()

          .optional(),




      isActive:
        z.boolean()

          .optional()
    })
  });