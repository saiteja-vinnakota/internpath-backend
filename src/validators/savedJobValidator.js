import { z }
from "zod";

import {
  objectIdSchema
} from "./commonValidator.js";




// Save Job Schema
export const saveJobSchema =
  z.object({

    params: z.object({

      jobId:
        objectIdSchema
    })
  });