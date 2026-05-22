import { z }
from "zod";

import {
  objectIdSchema
} from "./commonValidator.js";




// Apply To Job Schema
export const applyJobSchema =
  z.object({

    params: z.object({

      jobId:
        objectIdSchema
    })
  });




// Update Application Status
export const updateApplicationStatusSchema =
  z.object({

    params: z.object({

      applicationId:
        objectIdSchema
    }),

    body: z.object({

      status:
        z.enum([

          "pending",

          "shortlisted",

          "rejected",

          "accepted"
        ])
    })
  });