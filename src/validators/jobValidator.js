import { z }
from "zod";

import {
  objectIdSchema
} from "./commonValidator.js";

// COMMON JOB BODY SCHEMA
const jobBodySchema =
  z.object({

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

    category:
      z.string()

        .min(
          2,
          "Category is required"
        ),

    requiredSkills:
      z.array(
        z.string()
      )

        .min(
          1,
          "At least one skill required"
        ),

    perks:
      z.array(
        z.string()
      )

        .optional(),

    location:
      z.string()

        .min(
          2,
          "Location is required"
        ),

    mode:
      z.enum([
        "remote",
        "hybrid",
        "onsite",
      ]),

    stipend:
      z.number()

        .min(
          0,
          "Stipend cannot be negative"
        ),

    duration:
      z.string()

        .min(
          1,
          "Duration is required"
        ),

    openingsCount:
      z.number()

        .min(
          1,
          "At least one opening required"
        ),

    startDate:
      z.string()

        .optional(),

    deadline:
      z.string()

        .optional(),

    eligibleBatches:
      z.array(
        z.string()
      )

        .min(
          1,
          "At least one eligible batch required"
        ),

    eligibleDegrees:
      z.array(
        z.string()
      )

        .min(
          1,
          "At least one eligible degree required"
        ),

    minimumCGPA:
      z.number()

        .min(
          0,
          "CGPA cannot be negative"
        )

        .max(
          10,
          "CGPA cannot exceed 10"
        ),

    status:
      z.enum([
        "active",
        "closed",
        "draft",
      ])

        .optional(),

    featured:
      z.boolean()

        .optional(),

    isActive:
      z.boolean()

        .optional(),
  });

// CREATE JOB SCHEMA
export const createJobSchema =
  z.object({

    body:
      jobBodySchema,
  });

// UPDATE JOB SCHEMA
export const updateJobSchema =
  z.object({

    params:
      z.object({

        id:
          objectIdSchema,
      }),

    body:
      jobBodySchema
        .partial(),
  });