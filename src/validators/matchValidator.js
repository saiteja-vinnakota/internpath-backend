import { z }
from "zod";

import {
  objectIdSchema
} from "./commonValidator.js";




// Match Job Schema
export const matchJobSchema =
  z.object({

    params: z.object({

      jobId:
        objectIdSchema
    })
  });